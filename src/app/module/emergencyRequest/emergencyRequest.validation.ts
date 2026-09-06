import { z } from "zod";
import { Priority, RequestStatus } from "../../../generated/prisma/enums";

const createEmergencyRequestZodSchema = z.object({
  body: z.object({
    priority: z.nativeEnum(Priority, {
      error: "Priority is required",
    }),
    description: z.string().optional(),
    pickupAddress: z.string({
      error: "Pickup address is required",
    }),
    pickupLatitude: z.number({
      error: "Pickup latitude is required",
    }),
    pickupLongitude: z.number({
      error: "Pickup longitude is required",
    }),
  }),
});

const updateRequestStatusZodSchema = z.object({
  body: z.object({
    status: z.nativeEnum(RequestStatus, {
      error: "Status is required",
    }),
  }),
});

export const EmergencyRequestValidation = {
  createEmergencyRequestZodSchema,
  updateRequestStatusZodSchema,
};