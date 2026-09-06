import { z } from 'zod';

const createDispatch = z.object({
  body: z.object({
    emergencyRequestId: z.string({
      message: 'Emergency request ID is required',
    }),
    ambulanceId: z.string({
      message: 'Ambulance ID is required',
    }),
    notes: z.string().optional(),
  }),
});

const updateDispatch = z.object({
  body: z.object({
    notes: z.string().optional(),
  }),
});

export const DispatchValidation = {
  createDispatch,
  updateDispatch,
};