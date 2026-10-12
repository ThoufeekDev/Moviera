import { Router } from "express";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { validate } from "../../../../shared/middleware/validate";
import { adapt } from "../../../../shared/http/expressAdapter";
import { createScreenSchema } from "../schemas/CreateScreenSchema";
import { getTheatreOverviewParamSchema } from "../schemas/TheatreParamsSchema";
import { GetMyTheatresController } from "../controllers/GetMyTheatresController";
import { CreateScreenController } from "../controllers/CreateScreenController";
import { GetTheatreOverviewController } from "../controllers/GetTheatreOverviewController";
import { AssignTheatreAdminController } from "../controllers/AssignTheatreAdminController";
import { assignTheatreAdminSchema } from "../schemas/AssignTheatreAdminSchema";

interface TheatreRouteControllers {
  getMyTheatresController: GetMyTheatresController;
  createScreenController: CreateScreenController;
  getTheatreOverviewController: GetTheatreOverviewController;
  assignTheatreAdminController: AssignTheatreAdminController;

}

export function createTheatreRoutes(controllers: TheatreRouteControllers): Router {
  const router = Router();
  const theatreAdmin = [authenticateUser, authorizeRoles(Role.THEATRE_ADMIN)];
  const superAdmin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN)];

  router.get(
    "/my-theatres",
    ...theatreAdmin,
    adapt(controllers.getMyTheatresController.handle),
  );

  router.post(
    "/screens",
    ...theatreAdmin,
    validate({ body: createScreenSchema }),
    adapt(controllers.createScreenController.handle),
  );

  router.get(
    "/:theatreId",
    ...theatreAdmin,
    validate({ params: getTheatreOverviewParamSchema }),
    adapt(controllers.getTheatreOverviewController.handle),
  );

  router.post(
    '/admin-assignments',
    ...superAdmin,
    validate({ body: assignTheatreAdminSchema }),
    adapt(controllers.assignTheatreAdminController.handle)
  )




  return router;
}
