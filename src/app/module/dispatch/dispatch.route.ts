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



export const DispatchRoutes = router;