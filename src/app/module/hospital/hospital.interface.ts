export type THospital = {
  id?: string;
  name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  phone: string;
  totalBeds: number;
  availableBeds: number;
  isDeleted?: boolean;
  deletedAt?: Date | null;
};

export type THospitalFilterableFields = {
  searchTerm?: string;
  name?: string;
  city?: string;
};