
import httpStatus from "http-status";

import {
  TCreateEmergencyRequest,
  TEmergencyRequestFilterRequest,
} from "./emergencyRequest.interface";
import { emergencyRequestSearchableFields } from "./emergencyRequest.constant";
import { prisma } from "../../lib/prisma";
import { RequestStatus } from "../../../generated/prisma/enums";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationhelper";
import { Prisma } from "../../../generated/prisma/client";
import { TMeta } from "../../../interfaces/common";
import { AppError } from "../../utils/AppError";

const statusFlow: Record<string, string[]> = {
  REQUESTED: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["EN_ROUTE", "CANCELLED"],
  EN_ROUTE: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["HOSPITAL_SELECTED"],
  HOSPITAL_SELECTED: ["ARRIVED"],
  ARRIVED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const createEmergencyRequest = async (
  patientId: string,
  payload: TCreateEmergencyRequest
) => {
  const result = await prisma.emergencyRequest.create({
    data: {
      priority: payload.priority,
      description: payload.description,
      pickupAddress: payload.pickupAddress,
      pickupLatitude: payload.pickupLatitude,
      pickupLongitude: payload.pickupLongitude,
      status: RequestStatus.REQUESTED,
      patient: {
        connect: { id: patientId },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: patientId,
      action: "CREATE_EMERGENCY_REQUEST",
      entityType: "EmergencyRequest",
      entityId: result.id,
      newValue: {
        status: result.status,
        priority: result.priority,
        pickupAddress: result.pickupAddress,
      },
    },
  });

  return result;
};

const getAllEmergencyRequests = async (
  filters: TEmergencyRequestFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.EmergencyRequestWhereInput[] = [
    { isDeleted: false },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: emergencyRequestSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      })),
    });
  }

  const filterEntries = Object.entries(filterData).filter(
    ([, value]) => value !== undefined && value !== ""
  );

  if (filterEntries.length > 0) {
    andConditions.push({
      AND: filterEntries.map(([key, value]) => {
        return { [key]: value } as Prisma.EmergencyRequestWhereInput;
      }),
    });
  }

  const whereConditions: Prisma.EmergencyRequestWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.emergencyRequest.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : { createdAt: "desc" },
    include: {
      patient: {
        select: { id: true, name: true, phone: true },
      },
      ambulance: true,
      hospital: true,
      dispatch: true,
    },
  });

  const total = await prisma.emergencyRequest.count({
    where: whereConditions,
  });

  const meta: TMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return { meta, data: result };
};

const getEmergencyRequestById = async (id: string) => {
  const result = await prisma.emergencyRequest.findFirst({
    where: { id, isDeleted: false },
    include: {
      patient: { select: { id: true, name: true, phone: true } },
      ambulance: true,
      hospital: true,
      dispatch: true,
      payment: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Emergency request not found");
  }

  return result;
};

const updateRequestStatus = async (
  id: string,
  status: RequestStatus,
  updatedBy: string
) => {
  const requestData = await prisma.emergencyRequest.findFirst({
    where: { id, isDeleted: false },
  });

  if (!requestData) {
    throw new AppError(httpStatus.NOT_FOUND, "Emergency request not found");
  }

  const allowedNextStatuses = statusFlow[requestData.status];

  if (!allowedNextStatuses.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${requestData.status} to ${status}`
    );
  }

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updated = await tx.emergencyRequest.update({
      where: { id },
      data: { status },
    });

    await tx.auditLog.create({
      data: {
        userId: updatedBy,
        action: "UPDATE_REQUEST_STATUS",
        entityType: "EmergencyRequest",
        entityId: id,
        oldValue: { status: requestData.status },
        newValue: { status },
      },
    });

    return updated;
  });

  return result;
};

const cancelEmergencyRequest = async (id: string, patientId: string) => {
  const requestData = await prisma.emergencyRequest.findFirst({
    where: { id, isDeleted: false },
  });

  if (!requestData) {
    throw new AppError(httpStatus.NOT_FOUND, "Emergency request not found");
  }

  if (requestData.patientId !== patientId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only cancel your own request"
    );
  }

  if (requestData.status !== RequestStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only requests with REQUESTED status can be cancelled"
    );
  }

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updated = await tx.emergencyRequest.update({
      where: { id },
      data: { status: RequestStatus.CANCELLED },
    });

    await tx.auditLog.create({
      data: {
        userId: patientId,
        action: "CANCEL_EMERGENCY_REQUEST",
        entityType: "EmergencyRequest",
        entityId: id,
        oldValue: { status: requestData.status },
        newValue: { status: RequestStatus.CANCELLED },
      },
    });

    return updated;
  });

  return result;
};

const softDeleteEmergencyRequest = async (id: string) => {
  const result = await prisma.emergencyRequest.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return result;
};

export const EmergencyRequestService = {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateRequestStatus,
  cancelEmergencyRequest,
  softDeleteEmergencyRequest,
};