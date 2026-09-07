import { Role } from "../../../generated/prisma/enums";
import { PaymentWhereInput } from "../../../generated/prisma/models";
import { IQuery } from "../../../interfaces/common";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
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



export const PaymentServices = {
    getMyPayments,

};