
import httpStatus from "http-status";
 import {
	IAmbulanceCreate,
	IAmbulanceFilters,
	IAmbulanceLocationUpdate,
	IAmbulanceUpdate,
} from "./ambulance.interface";
import { AmbulanceStatus, Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { paginationHelper } from "../../utils/paginationhelper";

// CREATE
const createAmbulance = async (payload: IAmbulanceCreate) => {
	const existing = await prisma.ambulance.findFirst({
		where: { vehicleNumber: payload.vehicleNumber, deletedAt: null },
	});
	if (existing) {
		throw new AppError(httpStatus.CONFLICT, "This vehicle number is already registered!");
	}

	const { hospitalId, ...rest } = payload;

	const result = await prisma.ambulance.create({
		data: {
			...rest,
			status: AmbulanceStatus.AVAILABLE,
			...(hospitalId && { hospital: { connect: { id: hospitalId } } }),
		},
	});

	return result;
};

// GET MANY (pagination + filtering + search)
const getAllAmbulances = async (
	filters: IAmbulanceFilters,
	options: { page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
) => {
	const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
	const { searchTerm, status, type } = filters;

	const andConditions: Prisma.AmbulanceWhereInput[] = [{ deletedAt: null }];

	if (searchTerm) {
		andConditions.push({
			OR: [
				{ vehicleNumber: { contains: searchTerm, mode: "insensitive" } },
				{ driverName: { contains: searchTerm, mode: "insensitive" } },
			],
		});
	}

	if (status) andConditions.push({ status });
	if (type) andConditions.push({ type });

	const whereConditions: Prisma.AmbulanceWhereInput = { AND: andConditions };

	const result = await prisma.ambulance.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy: { [sortBy]: sortOrder },
	});

	const total = await prisma.ambulance.count({ where: whereConditions });

	return {
		meta: { page, limit, total },
		data: result,
	};
};

// GET SINGLE
const getAmbulanceById = async (id: string) => {
	const result = await prisma.ambulance.findFirst({
		where: { id, deletedAt: null },
		include: { hospital: true },
	});

	if (!result) {
		throw new AppError(httpStatus.NOT_FOUND, "Ambulance not found!");
	}

	return result;
};

// UPDATE
const updateAmbulance = async (id: string, payload: IAmbulanceUpdate) => {
	await getAmbulanceById(id); // throws if not found

	const result = await prisma.ambulance.update({
		where: { id },
		data: payload,
	});

	return result;
};

const updateAmbulanceStatus = async (id: string, status: AmbulanceStatus) => {
	const ambulance = await getAmbulanceById(id);
	if (
		ambulance.status === AmbulanceStatus.DISPATCHED &&
		status === AmbulanceStatus.AVAILABLE
	) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Cannot mark a dispatched ambulance as available directly. Complete the trip first!"
		);
	}

	const result = await prisma.ambulance.update({
		where: { id },
		data: { status },
	});

	return result;
};

const updateAmbulanceLocation = async (id: string, payload: IAmbulanceLocationUpdate) => {
	await getAmbulanceById(id);

	const result = await prisma.ambulance.update({
		where: { id },
		data: payload,
	});

	return result;
};

// SOFT DELETE
const deleteAmbulance = async (id: string) => {
	await getAmbulanceById(id);

	const result = await prisma.ambulance.update({
		where: { id },
		data: { deletedAt: new Date() },
	});

	return result;
};

export const AmbulanceService = {
	createAmbulance,
	getAllAmbulances,
	getAmbulanceById,
	updateAmbulance,
	updateAmbulanceStatus,
	updateAmbulanceLocation,
	deleteAmbulance,
};