import { z } from 'zod';

const createDispatch = z.object({
  body: z.object({
    emergencyRequestId: z.string({
      error: 'Emergency request ID is required',
    }),
    ambulanceId: z.string({
      error: 'Ambulance ID is required',
    }),
    notes: z.string().optional(),
  }),
});

const updateDispatch = z.object({
  body: z.object({
    notes: z.string().optional(),
  }),
});
const updateTripStatus = z.object({
  body: z.object({
    status: z.enum(
      ['EN_ROUTE', 'PICKED_UP', 'HOSPITAL_SELECTED', 'ARRIVED', 'COMPLETED'],
      { error: 'Status is required' }
    ),
  }),
});


export const DispatchValidation = {
  createDispatch,
  updateDispatch,
  updateTripStatus
};