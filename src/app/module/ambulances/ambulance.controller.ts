 import { Request, Response } from "express";
import httpStatus from "http-status";

import { AmbulanceService } from "./ambulance.service";
 import pick from "../../utils/pick";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createAmbulance = catchAsync(async (req: Request, res: Response) => {
	const result = await AmbulanceService.createAmbulance(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Ambulance created successfully",
		data: result,
	});
});

const getAllAmbulances = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, ["searchTerm", "status", "type"]);
	const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

	const result = await AmbulanceService.getAllAmbulances(filters, options);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ambulances retrieved successfully",
	 
		data: result.data,
	});
});

const getAmbulanceById = catchAsync(async (req: Request, res: Response) => {

	const result = await AmbulanceService.getAmbulanceById(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ambulance retrieved successfully",
		data: result,
	});
});

const updateAmbulance = catchAsync(async (req: Request, res: Response) => {
	const result = await AmbulanceService.updateAmbulance(req.params.id as string, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ambulance updated successfully",
		data: result,
	});
});

const updateAmbulanceStatus = catchAsync(async (req: Request, res: Response) => {
	const result = await AmbulanceService.updateAmbulanceStatus(req.params.id as string, req.body.status);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ambulance status updated successfully",
		data: result,
	});
});

const updateAmbulanceLocation = catchAsync(async (req: Request, res: Response) => {
	const result = await AmbulanceService.updateAmbulanceLocation(req.params.id as string, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ambulance location updated successfully",
		data: result,
	});
});

const deleteAmbulance = catchAsync(async (req: Request, res: Response) => {
	const result = await AmbulanceService.deleteAmbulance(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Ambulance deleted successfully",
		data: result,
	});
});

export const AmbulanceController = {
	createAmbulance,
	getAllAmbulances,
	getAmbulanceById,
	updateAmbulance,
	updateAmbulanceStatus,
	updateAmbulanceLocation,
	deleteAmbulance,
};


