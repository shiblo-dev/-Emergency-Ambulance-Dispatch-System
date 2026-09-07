import { AuditLogWhereInput } from "../../../generated/prisma/models";
import { IQuery } from "../../../interfaces/common";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
 import { IAuditLogFilters } from "./auditLog.interface";
import { auditLogSearchableFields } from "./auditLog.constant";
import { paginationHelper } from "../../utils/paginationhelper";

const getAllAuditLogs = async (
    filters: IAuditLogFilters,
    query: IQuery
) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(query);

    const {
        searchTerm,
        userId,
        action,
        entityType,
        entityId,
        ipAddress,
        startDate,
        endDate,
    } = filters;

    const andConditions: AuditLogWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: auditLogSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (userId) {
        andConditions.push({ userId });
    }

    if (action) {
        andConditions.push({ action });
    }

    if (entityType) {
        andConditions.push({ entityType });
    }

    if (entityId) {
        andConditions.push({ entityId });
    }

    if (ipAddress) {
        andConditions.push({ ipAddress });
    }

    if (startDate || endDate) {
        andConditions.push({
            createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
            },
        });
    }

    const whereConditions: AuditLogWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const auditLogs = await prisma.auditLog.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    const total = await prisma.auditLog.count({
        where: whereConditions,
    });

    return {
        data: auditLogs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getSingleAuditLog = async (auditLogId: string) => {
    const auditLog = await prisma.auditLog.findUnique({
        where: { id: auditLogId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!auditLog) {
        throw new AppError(httpStatus.NOT_FOUND, "Audit Log Not Found");
    }

    return auditLog;
};

export const AuditLogServices = {
    getAllAuditLogs,
    getSingleAuditLog,
};