import { z } from "zod";

const createHospitalZodSchema = z.object({
  body: z.object({
    name: z.string({ message: "Hospital name is required" }).min(1),
    address: z.string({ message: "Address is required" }).min(1),
    city: z.string({ message: "City is required" }).min(1),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    phone: z.string({ message: "Phone number is required" }).min(6),
    totalBeds: z
      .number({ message: "Total beds is required" })
      .int()
      .nonnegative(),
    availableBeds: z
      .number({ message: "Available beds is required" })
      .int()
      .nonnegative(),
  }),
});

const updateHospitalZodSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    phone: z.string().min(6).optional(),
    totalBeds: z.number().int().nonnegative().optional(),
    availableBeds: z.number().int().nonnegative().optional(),
  }),
});

export const HospitalValidation = {
  createHospitalZodSchema,
  updateHospitalZodSchema,
};