import { GetScreenSeatLayoutController } from "../controllers/GetScreenSeatLayoutController";
import { Router } from "express";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { validate } from "../../../../shared/middleware/validate";
import { adapt } from "../../../../shared/http/expressAdapter";

import {
  createSeatSchema,
  bulkCreateSeatsSchema,
} from "../schemas/CreateSeatSchema";

import { createSeatParamSchema, updateSeatParamSchema } from "../schemas/TheatreParamsSchema";

import { CreateSeatController } from "../controllers/CreateSeatController";
import { BulkCreateSeatsController } from "../controllers/BulkCreateSeatsController";
import { UpdateSeatLayoutController } from "../controllers/UpdateSeatLayoutController";
import { updateSeatLayoutSchema } from "../schemas/UpdateSeatLayoutSchema";
import { UpdateSeatController } from '../controllers/UpdateSeatController';
import { updateSeatSchema } from '../schemas/UpdateSeatSchema';
import { UpdateSeatPropertiesController } from '../controllers/UpdateSeatPropertiesController';
import { updateSeatPropertiesSchema } from '../schemas/UpdateSeatPropertiesSchema';

interface SeatRouteControllers {
  createSeatController: CreateSeatController;
  bulkCreateSeatsController: BulkCreateSeatsController;
  getScreenSeatLayoutController: GetScreenSeatLayoutController;
  updateSeatLayoutController: UpdateSeatLayoutController;
  updateSeatController: UpdateSeatController;
  updateSeatPropertiesController: UpdateSeatPropertiesController;
}

export function createSeatRoutes(controllers: SeatRouteControllers): Router {
  const router = Router();

  const theatreAdmin = [
    authenticateUser,
    authorizeRoles(Role.THEATRE_ADMIN),
  ];

  // Create individual seat
  router.post(
    "/screens/:screenId/seats",
    ...theatreAdmin,
    validate({
      params: createSeatParamSchema,
      body: createSeatSchema,
    }),
    adapt(controllers.createSeatController.handle),
  );

  // Bulk generate seats
  router.post(
    "/screens/:screenId/seats/bulk",
    ...theatreAdmin,
    validate({
      params: createSeatParamSchema,
      body: bulkCreateSeatsSchema,
    }),
    adapt(controllers.bulkCreateSeatsController.handle),
  );

  // Get screen seat layout
  router.get(
    "/screens/:screenId/seat-layout",
    ...theatreAdmin,
    validate({ params: createSeatParamSchema }),
    adapt(controllers.getScreenSeatLayoutController.handle),
  );

  // Batch update seat positions
  router.patch(
    "/screens/:screenId/seat-layout",
    ...theatreAdmin,
    validate({
      params: createSeatParamSchema,
      body: updateSeatLayoutSchema,
    }),
    adapt(controllers.updateSeatLayoutController.handle),
  );

  // Batch update seat properties (atomic)
  router.patch(
    "/screens/:screenId/seats/properties",
    ...theatreAdmin,
    validate({
      params: createSeatParamSchema,
      body: updateSeatPropertiesSchema,
    }),
    adapt(controllers.updateSeatPropertiesController.handle),
  );

  // Individual seat property update
  router.patch(
    '/seats/:seatId',
    ...theatreAdmin,
    validate({
      params: updateSeatParamSchema,
      body: updateSeatSchema,
    }),
    adapt(controllers.updateSeatController.handle),
  );

  return router;
}
