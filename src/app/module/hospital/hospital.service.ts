import httpStatus from "http-status";


import { THospital, THospitalFilterableFields } from "./hospital.interface";
import { hospitalSearchableFields } from "./hospital.constant";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { paginationHelper } from "../../utils/paginationhelper";
import { TMeta } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";


const createHospital = async (payload: THospital): Promise<THospital> => {
  const result = await prisma.hospital.create({
    data: payload,
  });
  return result;
};

const getAllHospitals = async (
  filters: THospitalFilterableFields,
  options: IPaginationOptions
): Promise<{ meta: TMeta; data: THospital[] }> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.HospitalWhereInput[] = [];

  andConditions.push({ isDeleted: false });

  if (searchTerm) {
    andConditions.push({
      OR: hospitalSearchableFields.map((field: string) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.HospitalWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.hospital.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.hospital.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSingleHospital = async (id: string): Promise<THospital> => {
  const result = await prisma.hospital.findFirst({
    where: { id, isDeleted: false },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Hospital not found");
  }

  return result;
};

const updateHospital = async (
  id: string,
  payload: Partial<THospital>
): Promise<THospital> => {
  await getSingleHospital(id);

  const result = await prisma.hospital.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteHospital = async (id: string): Promise<THospital> => {
  await getSingleHospital(id);

  const result = await prisma.hospital.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return result;
};

export const HospitalService = {
  createHospital,
  getAllHospitals,
  getSingleHospital,
  updateHospital,
  deleteHospital,
};