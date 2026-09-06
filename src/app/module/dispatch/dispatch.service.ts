 import httpStatus from 'http-status';

import {
  TDispatch,
  TDispatchFilters,
  dispatchSearchableFields,
} from './dispatch.interface';
import { AmbulanceStatus, Prisma, PrismaClient, RequestStatus } from '../../../generated/prisma/client';
import { AppError } from '../../utils/AppError';
import { paginationHelper } from '../../utils/paginationhelper';
import { prisma } from '../../lib/prisma';



const createDispatch = async (payload: TDispatch) => {
  const { emergencyRequestId, ambulanceId, dispatcherId, notes } = payload;
  const result = await prisma.$transaction(async (tx) => {
    const emergencyRequest = await tx.emergencyRequest.findUniqueOrThrow({
      where: { id: emergencyRequestId },
    });

    if (emergencyRequest.status !== RequestStatus.REQUESTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This emergency request is already being handled'
      );
    }
    const ambulanceUpdateResult = await tx.ambulance.updateMany({
      where: {
        id: ambulanceId,
        status: AmbulanceStatus.AVAILABLE,
      },
      data: {
        status: AmbulanceStatus.DISPATCHED,
      },
    });

    if (ambulanceUpdateResult.count === 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Ambulance is no longer available'
      );
    }

    const dispatch = await tx.dispatch.create({
      data: {
        emergencyRequestId,
        ambulanceId,
        dispatcherId,
        notes,
      },
      include: {
        ambulance: true,
        dispatcher: {
          select: { id: true, name: true, email: true, role: true },
        },
        emergencyRequest: true,
      },
    });
    await tx.emergencyRequest.update({
      where: { id: emergencyRequestId },
      data: { status: RequestStatus.DISPATCHED },
    });

  await tx.auditLog.create({
  data: {
    userId: dispatcherId,
    action: 'DISPATCH_CREATED',
    entityType: 'Dispatch',
    entityId: dispatch.id,
    newValue: {
      emergencyRequestId,
      ambulanceId,
      dispatcherId,
    },
  },
});
    return dispatch;
  });

  return result;
};



export const DispatchService = {
  createDispatch,
  
};