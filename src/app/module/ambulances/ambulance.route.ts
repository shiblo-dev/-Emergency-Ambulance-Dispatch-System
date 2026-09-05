// NOTE: Adjust these import paths to match your actual project structure
import express from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AmbulanceValidation } from "./ambulance.validation";
import { AmbulanceController } from "./ambulance.controller";

const router = express.Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.DISPATCHER),
	validateRequest(AmbulanceValidation.AmbulanceCreateZodSchema),
	AmbulanceController.createAmbulance
);

router.get("/", auth(Role.ADMIN, Role.DISPATCHER, Role.PATIENT), AmbulanceController.getAllAmbulances);

router.get("/:id", auth(Role.ADMIN, Role.DISPATCHER, Role.PATIENT), AmbulanceController.getAmbulanceById);

router.patch(
	"/:id",
	auth(Role.ADMIN, Role.DISPATCHER),
	validateRequest(AmbulanceValidation.AmbulanceUpdateZodSchema),
	AmbulanceController.updateAmbulance
);

router.patch(
	"/:id/status",
	auth(Role.ADMIN, Role.DISPATCHER),
	validateRequest(AmbulanceValidation.AmbulanceStatusUpdateZodSchema),
	AmbulanceController.updateAmbulanceStatus
);

router.patch(
	"/:id/location",
	auth(Role.ADMIN, Role.DISPATCHER),
	validateRequest(AmbulanceValidation.AmbulanceLocationUpdateZodSchema),
	AmbulanceController.updateAmbulanceLocation
);

router.delete("/:id", auth(Role.ADMIN), AmbulanceController.deleteAmbulance);

export const AmbulanceRoutes = router;