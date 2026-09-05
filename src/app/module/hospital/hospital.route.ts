import express from "express";
 import { HospitalValidation } from "./hospital.validation";
import { HospitalController } from "./hospital.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(HospitalValidation.createHospitalZodSchema),
  HospitalController.createHospital
);

router.get("/", HospitalController.getAllHospitals);

router.get("/:id", HospitalController.getSingleHospital);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(HospitalValidation.updateHospitalZodSchema),
  HospitalController.updateHospital
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  HospitalController.deleteHospital
);

export const HospitalRoutes = router;