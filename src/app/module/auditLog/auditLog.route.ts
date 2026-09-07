import { Router } from "express";
 import { Role } from "../../../generated/prisma/enums";
import { AuditLogControllers } from "./auditLog.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get(
    "/",
    auth(Role.ADMIN),
    AuditLogControllers.getAllAuditLogs
);

router.get(
    "/:auditLogId",
    auth(Role.ADMIN),
    AuditLogControllers.getSingleAuditLog
);

export const AuditLogRoutes = router;