import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";
import { RequestUser } from "../../middleware/checkAuth";

const getAdminDashboard = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalyticsServices.getAdminDashboard();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Dashboard Analytics Retrieved Successfully",
        data: result,
    });
});

const getDispatcherDashboard = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AnalyticsServices.getDispatcherDashboard();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Dispatcher Dashboard Analytics Retrieved Successfully",
            data: result,
        });
    }
);

const getPatientDashboard = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as RequestUser;
        const result = await AnalyticsServices.getPatientDashboard(user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Patient Dashboard Analytics Retrieved Successfully",
            data: result,
        });
    }
);

export const AnalyticsControllers = {
    getAdminDashboard,
    getDispatcherDashboard,
    getPatientDashboard,
};