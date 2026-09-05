import { Request, Response } from "express";
import httpStatus from "http-status";
  import { HospitalService } from "./hospital.service";
import { THospital } from "./hospital.interface";
import pick from "../../utils/pick";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { hospitalFilterableFields, paginationFields } from "./hospital.constant";

const createHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.createHospital(req.body);

  sendResponse<THospital>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Hospital created successfully",
    data: result,
  });
});

const getAllHospitals = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, hospitalFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await HospitalService.getAllHospitals(
    filters,
    paginationOptions
  );

  sendResponse<THospital[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospitals fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleHospital = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await HospitalService.getSingleHospital(id);

  sendResponse<THospital>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital fetched successfully",
    data: result,
  });
});

const updateHospital = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await HospitalService.updateHospital(id, req.body);

  sendResponse<THospital>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital updated successfully",
    data: result,
  });
});

const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await HospitalService.deleteHospital(id);

  sendResponse<THospital>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital deleted successfully",
    data: result,
  });
});

export const HospitalController = {
  createHospital,
  getAllHospitals,
  getSingleHospital,
  updateHospital,
  deleteHospital,
};