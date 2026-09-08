import { Role } from "../../../generated/prisma/enums";
import type { PaymentWhereInput } from "../../../generated/prisma/models";
import type { IQuery } from "../../../interfaces/common";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/checkAuth";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const getMyPayments = async (query: IQuery, user: RequestUser) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder ? query.sortOrder : "desc";

	const andConditions: PaymentWhereInput[] = [
		{
			patientId: user.userId,
		},
	];

	const payments = await prisma.payment.findMany({
		where: { AND: andConditions },
		take: limit,
		skip,
		orderBy: { [sortBy]: sortOrder },
		include: {
			emergencyRequest: true,
		},
	});

	const total = await prisma.payment.count({
		where: { AND: andConditions },
	});

	return {
		data: payments,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};
const getAllPayments = async (query: IQuery) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder ? query.sortOrder : "desc";

	const andConditions: PaymentWhereInput[] = [];

	if (query.patientEmail) {
		andConditions.push({
			patient: {
				email: query.patientEmail as string,
			},
		});
	}

	if (query.status) {
		andConditions.push({
			status: query.status as PaymentWhereInput["status"],
		});
	}

	const whereConditions: PaymentWhereInput =
		andConditions.length > 0 ? { AND: andConditions } : {};

	const payments = await prisma.payment.findMany({
		where: whereConditions,
		take: limit,
		skip,
		orderBy: { [sortBy]: sortOrder },
		include: {
			patient: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			emergencyRequest: true,
		},
	});

	const total = await prisma.payment.count({
		where: whereConditions,
	});

	return {
		data: payments,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getSinglePayment = async (paymentId: string, user: RequestUser) => {
	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
		include: {
			patient: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			emergencyRequest: true,
		},
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found");
	}

	if (user.role === Role.PATIENT && payment.patientId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You Are Not Allowed To View This Payment",
		);
	}

	return payment;
};

export const PaymentServices = {
	getMyPayments,
	getAllPayments,
	getSinglePayment,
};
