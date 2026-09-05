import z from "zod";

import { AmbulanceStatus } from "../../../generated/prisma/enums";

const AmbulanceCreateZodSchema = z.object({
	vehicleNumber: z
		.string("Vehicle number must be a string!!")
		.min(3, "Vehicle number is too short!!")
		.max(20),
	driverName: z
		.string("Driver name must be a string!!")
		.min(3, "Driver name must be at least 3 characters!!")
		.max(50),
	driverPhone: z
		.string("Driver phone must be a string!!")
		.min(11, "Phone number must be at least 11 characters!!")
		.max(15),
	driverLicense: z  
    .string("License number must be a string!!")
    .min(3)
    .max(30),
	type: z
		.string("Ambulance type must be a string!!")
		.min(2, "Ambulance type is required!!")
		.max(30), // e.g. BASIC, ICU, CARDIAC
	currentLatitude: z.number().min(-90).max(90).optional(),
	currentLongitude: z.number().min(-180).max(180).optional(),
	hospitalId: z.string("hospitalId must be a string!!").optional(),
});

const AmbulanceUpdateZodSchema = AmbulanceCreateZodSchema.partial();

const AmbulanceStatusUpdateZodSchema = z.object({
	status: z.enum(AmbulanceStatus, "Invalid ambulance status!!"),
});

const AmbulanceLocationUpdateZodSchema = z.object({
	currentLatitude: z.number("currentLatitude must be a number!!").min(-90).max(90),
	currentLongitude: z.number("currentLongitude must be a number!!").min(-180).max(180),
});

export const AmbulanceValidation = {
	AmbulanceCreateZodSchema,
	AmbulanceUpdateZodSchema,
	AmbulanceStatusUpdateZodSchema,
	AmbulanceLocationUpdateZodSchema,
};