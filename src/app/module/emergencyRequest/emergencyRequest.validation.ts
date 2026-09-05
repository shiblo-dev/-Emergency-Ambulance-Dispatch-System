import { z } from "zod";
import { Priority, RequestStatus } from "../../../generated/prisma/enums";

const createEmergencyRequestZodSchema = z.object({
  body: z.object({
    priority: z.nativeEnum(Priority, {
      message: "Priority is required",
    }),
    description: z.string().optional(),
    pickupAddress: z.string({
      message: "Pickup address is required",
    }),
    pickupLatitude: z.number({
      message: "Pickup latitude is required",
    }),
    pickupLongitude: z.number({
      message: "Pickup longitude is required",
    }),
  }),
});

const updateRequestStatusZodSchema = z.object({
  body: z.object({
    status: z.nativeEnum(RequestStatus, {
      message: "Status is required",
    }),
  }),
});

export const EmergencyRequestValidation = {
  createEmergencyRequestZodSchema,
  updateRequestStatusZodSchema,
};