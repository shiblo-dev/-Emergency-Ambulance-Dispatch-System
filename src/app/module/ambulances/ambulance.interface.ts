// NOTE: Adjust this import path to match where your Prisma-generated enums live

import { AmbulanceStatus } from "../../../generated/prisma/enums";

export interface IAmbulanceCreate {
	vehicleNumber: string;
	driverName: string;
	driverPhone: string;
	driverLicense: string;  
	type: string;
	currentLatitude?: number;
	currentLongitude?: number;
	hospitalId?: string;
}

export interface IAmbulanceUpdate extends Partial<IAmbulanceCreate> {}

export interface IAmbulanceFilters {
	status?: AmbulanceStatus;
	type?: string;
	searchTerm?: string;
}

export interface IAmbulanceLocationUpdate {
	currentLatitude: number;
	currentLongitude: number;
}