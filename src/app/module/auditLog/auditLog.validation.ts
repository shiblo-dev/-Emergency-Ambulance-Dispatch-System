import { z } from "zod";

const getAuditLogsQuery = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        userId: z.string().optional(),
        action: z.string().optional(),
        entityType: z.string().optional(),
        entityId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    }),
});

export const AuditLogValidation = {
    getAuditLogsQuery,
};