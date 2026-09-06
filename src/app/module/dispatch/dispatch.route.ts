import express from 'express';

import { DispatchValidation } from './dispatch.validation';
import { DispatchController } from './dispatch.controller';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/',
  auth(Role.DISPATCHER, Role.ADMIN),
  validateRequest(DispatchValidation.createDispatch),
  DispatchController.createDispatch
);
router.get(
  '/',
  auth(Role.DISPATCHER, Role.ADMIN),
  DispatchController.getAllDispatches
);
router.get(
  '/:id',
  auth(Role.DISPATCHER, Role.ADMIN),
  DispatchController.getSingleDispatch
);
router.patch(
  '/:id',
  auth(Role.DISPATCHER, Role.ADMIN),
  validateRequest(DispatchValidation.updateDispatch),
  DispatchController.updateDispatch
);
router.patch(
  '/:id/status',
  auth(Role.DISPATCHER, Role.ADMIN),
  validateRequest(DispatchValidation.updateTripStatus),
  DispatchController.updateTripStatus
);

export const DispatchRoutes = router;