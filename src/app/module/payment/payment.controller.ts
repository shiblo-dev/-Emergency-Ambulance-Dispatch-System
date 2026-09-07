import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PaymentServices } from "./payment.service";
import { Request, Response } from "express";


const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;

    const { data, meta } = await PaymentServices.getMyPayments(req.query, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments Retrieved Successfully",
        data,
        meta,
    });
});
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await PaymentServices.getAllPayments(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments Retrieved Successfully",
        data,
        meta,
    });
});



export const PaymentController = {
    getMyPayments,
    getAllPayments

};
