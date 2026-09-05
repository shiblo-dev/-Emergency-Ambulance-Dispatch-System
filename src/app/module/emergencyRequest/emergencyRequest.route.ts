import express from "express";

import { EmergencyRequestValidation } from "./emergencyRequest.validation";
import { EmergencyRequestController } from "./emergencyRequest.controller";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  auth(Role.PATIENT),
  validateRequest(EmergencyRequestValidation.createEmergencyRequestZodSchema),
  EmergencyRequestController.createEmergencyRequest
);

router.get(
  "/",
  auth(Role.DISPATCHER, Role.ADMIN),
  EmergencyRequestController.getAllEmergencyRequests
);

router.get(
  "/:id",
  auth(Role.PATIENT, Role.DISPATCHER, Role.ADMIN),
  EmergencyRequestController.getEmergencyRequestById
);

router.patch(
  "/:id/status",
  auth(Role.DISPATCHER, Role.ADMIN),
  validateRequest(EmergencyRequestValidation.updateRequestStatusZodSchema),
  EmergencyRequestController.updateRequestStatus
);

router.patch(
  "/:id/cancel",
  auth(Role.PATIENT),
  EmergencyRequestController.cancelEmergencyRequest
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  EmergencyRequestController.softDeleteEmergencyRequest
);

export const EmergencyRequestRoutes = router;