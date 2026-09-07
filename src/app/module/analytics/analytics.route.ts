import { Router } from "express";
 import { Role } from "../../../generated/prisma/enums";
import { AnalyticsControllers } from "./analytics.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get(
    "/admin",
    auth(Role.ADMIN),
    AnalyticsControllers.getAdminDashboard
);

router.get(
    "/dispatcher",
    auth(Role.DISPATCHER, Role.ADMIN),
    AnalyticsControllers.getDispatcherDashboard
);

router.get(
    "/patient",
    auth(Role.PATIENT),
    AnalyticsControllers.getPatientDashboard
);

export const AnalyticsRoutes = router;