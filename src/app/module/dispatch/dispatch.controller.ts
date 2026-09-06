import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { DispatchService } from './dispatch.service';
import pick from '../../utils/pick';
import { dispatchFilterableFields } from './dispatch.interface';


const createDispatch = catchAsync(async (req: Request, res: Response) => {
  const dispatcherId = req.user?.userId as string;

  const result = await DispatchService.createDispatch({
    ...req.body,
    dispatcherId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Ambulance dispatched successfully',
    data: result,
  });
});

const getAllDispatches = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dispatchFilterableFields);
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await DispatchService.getAllDispatches(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dispatches retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDispatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DispatchService.getSingleDispatch(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dispatch retrieved successfully',
    data: result,
  });
});


const updateDispatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DispatchService.updateDispatch(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dispatch updated successfully',
    data: result,
  });
});
const updateTripStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.userId as string;

  const result = await DispatchService.updateTripStatus(id as string, status, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trip status updated successfully',
    data: result,
  });
});
export const DispatchController = {
  createDispatch,
getAllDispatches,
getSingleDispatch,
updateDispatch,
updateTripStatus
};