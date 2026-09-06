 import httpStatus from 'http-status';

import {
  TDispatch,
  TDispatchFilters,
  dispatchSearchableFields,
} from './dispatch.interface';
import { AmbulanceStatus, Prisma, PrismaClient, RequestStatus } from '../../../generated/prisma/client';
import { AppError } from '../../utils/AppError';
import { paginationHelper } from '../../utils/paginationhelper';
import { prisma } from '../../lib/prisma';



const createDispatch = async (payload: TDispatch) => {
  const { emergencyRequestId, ambulanceId, dispatcherId, notes } = payload;
  const result = await prisma.$transaction(async (tx) => {
    const emergencyRequest = await tx.emergencyRequest.findUniqueOrThrow({
      where: { id: emergencyRequestId },
    });

    if (emergencyRequest.status !== RequestStatus.REQUESTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This emergency request is already being handled'
      );
    }
    const ambulanceUpdateResult = await tx.ambulance.updateMany({
      where: {
        id: ambulanceId,
        status: AmbulanceStatus.AVAILABLE,
      },
      data: {
        status: AmbulanceStatus.DISPATCHED,
      },
    });

    if (ambulanceUpdateResult.count === 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Ambulance is no longer available'
      );
    }

    const dispatch = await tx.dispatch.create({
      data: {
        emergencyRequestId,
        ambulanceId,
        dispatcherId,
        notes,
      },
      include: {
        ambulance: true,
        dispatcher: {
          select: { id: true, name: true, email: true, role: true },
        },
        emergencyRequest: true,
      },
    });
    await tx.emergencyRequest.update({
      where: { id: emergencyRequestId },
      data: { status: RequestStatus.DISPATCHED },
    });

  await tx.auditLog.create({
  data: {
    userId: dispatcherId,
    action: 'DISPATCH_CREATED',
    entityType: 'Dispatch',
    entityId: dispatch.id,
    newValue: {
      emergencyRequestId,
      ambulanceId,
      dispatcherId,
    },
  },
});
    return dispatch;
  });

  return result;
};

const getAllDispatches = async (
  filters: TDispatchFilters,
  paginationOptions: any
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions: Prisma.DispatchWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: dispatchSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: (filterData as any)[key],
      })),
    });
  }
  const whereConditions: Prisma.DispatchWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.dispatch.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: {
      ambulance: true,
      dispatcher: { select: { id: true, name: true, email: true } },
      emergencyRequest: true,
    },
  });

  const total = await prisma.dispatch.count({ where: whereConditions });

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: result,
  };
};

const getSingleDispatch = async (id: string) => {
  const result = await prisma.dispatch.findUniqueOrThrow({
    where: { id },
    include: {
      ambulance: true,
      dispatcher: { select: { id: true, name: true, email: true } },
      emergencyRequest: true,
    },
  });
  return result;
};

export const DispatchService = {
  createDispatch,
  getAllDispatches,
  getSingleDispatch

};