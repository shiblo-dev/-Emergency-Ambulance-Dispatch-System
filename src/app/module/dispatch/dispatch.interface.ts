export type TDispatch = {
  emergencyRequestId: string;
  ambulanceId: string;
  dispatcherId: string;
  notes?: string;
};

export type TDispatchFilters = {
  searchTerm?: string;
  ambulanceId?: string;
  dispatcherId?: string;
  emergencyRequestId?: string;
};

export const dispatchSearchableFields: string[] = ['notes'];

export const dispatchFilterableFields: string[] = [
  'searchTerm',
  'ambulanceId',
  'dispatcherId',
  'emergencyRequestId',
];