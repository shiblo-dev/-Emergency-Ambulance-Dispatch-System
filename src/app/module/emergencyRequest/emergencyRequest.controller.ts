import { Request, Response } from "express";
import httpStatus from "http-status";

import { emergencyRequestFilterableFields } from "./emergencyRequest.constant";
import { EmergencyRequestService } from "./emergencyRequest.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import pick from "../../utils/pick";

const createEmergencyRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const patientId = req.user.id;
    const result = await EmergencyRequestService.createEmergencyRequest(
      patientId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Emergency request created successfully",
      data: result,
    });
  }
);

const getAllEmergencyRequests = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, emergencyRequestFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await EmergencyRequestService.getAllEmergencyRequests(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency requests retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getEmergencyRequestById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EmergencyRequestService.getEmergencyRequestById(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency request retrieved successfully",
      data: result,
    });
  }
);

const updateRequestStatus = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updatedBy = req.user.id;

    const result = await EmergencyRequestService.updateRequestStatus(
      id  as string,
      status,
      updatedBy
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Request status updated successfully",
      data: result,
    });
  }
);

const cancelEmergencyRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const patientId = req.user.id;

    const result = await EmergencyRequestService.cancelEmergencyRequest(
      id as string,
      patientId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency request cancelled successfully",
      data: result,
    });
  }
);

const softDeleteEmergencyRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EmergencyRequestService.softDeleteEmergencyRequest(
      id as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency request deleted successfully",
      data: result,
    });
  }
);

export const EmergencyRequestController = {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateRequestStatus,
  cancelEmergencyRequest,
  softDeleteEmergencyRequest,
};