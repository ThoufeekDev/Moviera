import { Router } from "express";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { validate } from "../../../../shared/middleware/validate";
import { adapt } from "../../../../shared/http/expressAdapter";
import { createSeatSchema } from "../schemas/CreateSeatSchema";
import { createSeatParamSchema } from "../schemas/TheatreParamsSchema";
import { CreateSeatController } from "../controllers/CreateSeatController";

interface SeatRouteControllers {
  createSeatController: CreateSeatController;
}

export function createSeatRoutes(controllers: SeatRouteControllers): Router {
  const router = Router();
  const theatreAdmin = [authenticateUser, authorizeRoles(Role.THEATRE_ADMIN)];

  router.post(
    "/screens/:screenId/seats",
    ...theatreAdmin,
    validate({ params: createSeatParamSchema, body: createSeatSchema }),
    adapt(controllers.createSeatController.handle),
  );

  return router;
}
