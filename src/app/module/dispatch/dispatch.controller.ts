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

export const DispatchController = {
  createDispatch,

};