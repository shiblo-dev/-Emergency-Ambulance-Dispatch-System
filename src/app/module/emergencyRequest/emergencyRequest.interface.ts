import { Priority, RequestStatus } from "../../../generated/prisma/enums";


export type TEmergencyRequestFilterRequest = {
  searchTerm?: string;
  status?: RequestStatus;
  priority?: Priority;
  patientId?: string;
};

export type TCreateEmergencyRequest = {
  priority: Priority;
  description?: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
};

export type TUpdateRequestStatus = {
  status: RequestStatus;
};