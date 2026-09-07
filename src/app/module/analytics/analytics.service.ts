import { Role, RequestStatus, AmbulanceStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";

const TERMINAL_STATUSES: RequestStatus[] = [
    RequestStatus.COMPLETED,
    RequestStatus.CANCELLED,
];

const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const getAdminDashboard = async () => {
    const startOfToday = getStartOfToday();

    const [
        totalRequests,
        requestsByStatus,
        requestsByPriority,
        totalAmbulances,
        ambulancesByStatus,
        totalUsers,
        usersByRole,
        revenueAgg,
        todayRequestsCount,
        todayCompletedCount,
        dispatchesForResponseTime,
    ] = await Promise.all([
        prisma.emergencyRequest.count({ where: { isDeleted: false } }),

        prisma.emergencyRequest.groupBy({
            by: ["status"],
            where: { isDeleted: false },
            _count: { _all: true },
        }),

        prisma.emergencyRequest.groupBy({
            by: ["priority"],
            where: { isDeleted: false },
            _count: { _all: true },
        }),

        prisma.ambulance.count(),

        prisma.ambulance.groupBy({
            by: ["status"],
            _count: { _all: true },
        }),

        prisma.user.count(),

        prisma.user.groupBy({
            by: ["role"],
            _count: { _all: true },
        }),

        prisma.payment.aggregate({
            where: { status: PaymentStatus.PAID },
            _sum: { amount: true },
        }),

        prisma.emergencyRequest.count({
            where: {
                isDeleted: false,
                createdAt: { gte: startOfToday },
            },
        }),

        prisma.emergencyRequest.count({
            where: {
                isDeleted: false,
                status: RequestStatus.COMPLETED,
                updatedAt: { gte: startOfToday },
            },
        }),

        prisma.dispatch.findMany({
            select: {
                dispatchedAt: true,
                emergencyRequest: {
                    select: { createdAt: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 500,
        }),
    ]);

    let averageResponseTimeInMinutes: number | null = null;

    if (dispatchesForResponseTime.length > 0) {
        const totalDiffMs = dispatchesForResponseTime.reduce((sum, d) => {
            const diff =
                d.dispatchedAt.getTime() -
                d.emergencyRequest.createdAt.getTime();
            return sum + (diff > 0 ? diff : 0);
        }, 0);

        averageResponseTimeInMinutes =
            Math.round(
                (totalDiffMs / dispatchesForResponseTime.length / 60000) * 100
            ) / 100;
    }

    const availableAmbulanceCount =
        ambulancesByStatus.find((a) => a.status === AmbulanceStatus.AVAILABLE)
            ?._count._all ?? 0;

    const ambulanceUtilizationRate =
        totalAmbulances > 0
            ? Math.round(
                  ((totalAmbulances - availableAmbulanceCount) /
                      totalAmbulances) *
                      100 *
                      100
              ) / 100
            : 0;

    return {
        requests: {
            total: totalRequests,
            today: todayRequestsCount,
            completedToday: todayCompletedCount,
            byStatus: requestsByStatus.map((r) => ({
                status: r.status,
                count: r._count._all,
            })),
            byPriority: requestsByPriority.map((r) => ({
                priority: r.priority,
                count: r._count._all,
            })),
        },
        ambulances: {
            total: totalAmbulances,
            available: availableAmbulanceCount,
            utilizationRate: ambulanceUtilizationRate,
            byStatus: ambulancesByStatus.map((a) => ({
                status: a.status,
                count: a._count._all,
            })),
        },
        users: {
            total: totalUsers,
            byRole: usersByRole.map((u) => ({
                role: u.role,
                count: u._count._all,
            })),
        },
        revenue: {
            total: revenueAgg._sum.amount ?? 0,
        },
        performance: {
            averageResponseTimeInMinutes,
            sampleSize: dispatchesForResponseTime.length,
        },
    };
};

const getDispatcherDashboard = async () => {
    const startOfToday = getStartOfToday();

    const [
        activeRequestsCount,
        activeRequestsByStatus,
        availableAmbulanceCount,
        totalAmbulanceCount,
        todayCompletedCount,
        pendingRequests,
    ] = await Promise.all([
        prisma.emergencyRequest.count({
            where: {
                isDeleted: false,
                status: { notIn: TERMINAL_STATUSES },
            },
        }),

        prisma.emergencyRequest.groupBy({
            by: ["status"],
            where: {
                isDeleted: false,
                status: { notIn: TERMINAL_STATUSES },
            },
            _count: { _all: true },
        }),

        prisma.ambulance.count({
            where: { status: AmbulanceStatus.AVAILABLE },
        }),

        prisma.ambulance.count(),

        prisma.emergencyRequest.count({
            where: {
                isDeleted: false,
                status: RequestStatus.COMPLETED,
                updatedAt: { gte: startOfToday },
            },
        }),

        prisma.emergencyRequest.findMany({
            where: {
                isDeleted: false,
                status: RequestStatus.REQUESTED,
            },
            orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
            take: 10,
            include: {
                patient: {
                    select: { id: true, name: true, phone: true },
                },
            },
        }),
    ]);

    return {
        activeRequests: {
            total: activeRequestsCount,
            byStatus: activeRequestsByStatus.map((r) => ({
                status: r.status,
                count: r._count._all,
            })),
        },
        ambulances: {
            available: availableAmbulanceCount,
            total: totalAmbulanceCount,
        },
        completedToday: todayCompletedCount,
        pendingRequests,
    };
};

const getPatientDashboard = async (user: RequestUser) => {
    const [totalRequests, requestsByStatus, totalSpentAgg, recentRequests] =
        await Promise.all([
            prisma.emergencyRequest.count({
                where: { patientId: user.userId, isDeleted: false },
            }),

            prisma.emergencyRequest.groupBy({
                by: ["status"],
                where: { patientId: user.userId, isDeleted: false },
                _count: { _all: true },
            }),

            prisma.payment.aggregate({
                where: {
                    patientId: user.userId,
                    status: PaymentStatus.PAID,
                },
                _sum: { amount: true },
            }),

            prisma.emergencyRequest.findMany({
                where: { patientId: user.userId, isDeleted: false },
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    ambulance: {
                        select: { vehicleNumber: true, driverName: true },
                    },
                    hospital: {
                        select: { name: true },
                    },
                },
            }),
        ]);

    return {
        requests: {
            total: totalRequests,
            byStatus: requestsByStatus.map((r) => ({
                status: r.status,
                count: r._count._all,
            })),
        },
        totalSpent: totalSpentAgg._sum.amount ?? 0,
        recentRequests,
    };
};

export const AnalyticsServices = {
    getAdminDashboard,
    getDispatcherDashboard,
    getPatientDashboard,
};