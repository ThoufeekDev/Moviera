import { Router } from 'express';
import { authenticateUser } from '../../../../shared/middleware/authenticateUser';
import { authorizeRoles } from '../../../../shared/middleware/authorizeRoles';
import { Role } from '../../../../shared/enums/Role';
import { validate } from '../../../../shared/middleware/validate';
import { adapt } from '../../../../shared/http/expressAdapter';
import { createScreenSchema } from '../schemas/CreateScreenSchema';
import { getTheatreOverviewParamSchema } from '../schemas/TheatreParamsSchema';
import { GetMyTheatresController } from '../controllers/GetMyTheatresController';
import { CreateScreenController } from '../controllers/CreateScreenController';
import { GetTheatreOverviewController } from '../controllers/GetTheatreOverviewController';
import { AssignTheatreAdminController } from '../controllers/AssignTheatreAdminController';
import { assignTheatreAdminSchema } from '../schemas/AssignTheatreAdminSchema';
import { UpdateTheatreAdminAssignmentController } from '../controllers/UpdateTheatreAdminAssignmentController';
import {
  updateTheatreAdminAssignmentBodySchema,
  updateTheatreAdminAssignmentParamSchema,
} from '../schemas/UpdateTheatreAdminAssignmentSchema';
import { RevokeTheatreAdminAssignmentController } from '../controllers/RevokeTheatreAdminAssignmentController';
import { revokeTheatreAdminAssignmentParamSchema } from '../schemas/RevokeTheatreAdminAssignmentSchema';
import { ListTheatresForAdminController } from '../controllers/ListTheatresForAdminController';
import { listTheatresForAdminQuerySchema } from '../schemas/ListTheatresForAdminSchema';
import { ListTheatreAdminAssignmentsController } from '../controllers/ListTheatreAdminAssignmentsController';
import { listTheatreAdminAssignmentsQuerySchema } from '../schemas/ListTheatreAdminAssignmentsSchema';
import { ListEligibleTheatreAdminsController } from '../controllers/ListEligibleTheatreAdminsController';
import { listEligibleAdminsQuerySchema } from '../schemas/ListEligibleAdminsSchema';
import { GetTheatreAdminStatsController } from '../controllers/GetTheatreAdminStatsController';

interface TheatreRouteControllers {
  getMyTheatresController: GetMyTheatresController;
  createScreenController: CreateScreenController;
  getTheatreOverviewController: GetTheatreOverviewController;
  assignTheatreAdminController: AssignTheatreAdminController;
  updateTheatreAdminAssignmentController: UpdateTheatreAdminAssignmentController;
  revokeTheatreAdminAssignmentController: RevokeTheatreAdminAssignmentController;
  listTheatresForAdminController: ListTheatresForAdminController;
  listTheatreAdminAssignmentsController: ListTheatreAdminAssignmentsController;
  listEligibleTheatreAdminsController: ListEligibleTheatreAdminsController;
  getTheatreAdminStatsController: GetTheatreAdminStatsController;
}

export function createTheatreRoutes(controllers: TheatreRouteControllers): Router {
  const router = Router();
  const theatreAdmin = [authenticateUser, authorizeRoles(Role.THEATRE_ADMIN)];
  const superAdmin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN)];

  // ── Theatre Admin Routes ──────────────────────────────────────────────────
  router.get(
    '/my-theatres',
    ...theatreAdmin,
    adapt(controllers.getMyTheatresController.handle),
  );

  router.post(
    '/screens',
    ...theatreAdmin,
    validate({ body: createScreenSchema }),
    adapt(controllers.createScreenController.handle),
  );

  // ── Super Admin Theatre Management Routes ─────────────────────────────────
  // 1. List theatres with screen/seat counts and assigned admins for Super Admin
  router.get(
    '/for-admin',
    ...superAdmin,
    validate({ query: listTheatresForAdminQuerySchema }),
    adapt(controllers.listTheatresForAdminController.handle),
  );

  // 2. High-level dashboard statistics
  router.get(
    '/admin-stats',
    ...superAdmin,
    adapt(controllers.getTheatreAdminStatsController.handle),
  );

  // 3. Eligible users with THEATRE_ADMIN role
  router.get(
    '/eligible-admins',
    ...superAdmin,
    validate({ query: listEligibleAdminsQuerySchema }),
    adapt(controllers.listEligibleTheatreAdminsController.handle),
  );

  // 4. Assignments listing (all or by theatre)
  router.get(
    '/admin-assignments',
    ...superAdmin,
    validate({ query: listTheatreAdminAssignmentsQuerySchema }),
    adapt(controllers.listTheatreAdminAssignmentsController.handle),
  );

  // 5. Assign admin to theatre
  router.post(
    '/admin-assignments',
    ...superAdmin,
    validate({ body: assignTheatreAdminSchema }),
    adapt(controllers.assignTheatreAdminController.handle),
  );

  // 6. Update assignment status (Active/Suspended) or role
  router.patch(
    '/admin-assignments/:assignmentId',
    ...superAdmin,
    validate({
      params: updateTheatreAdminAssignmentParamSchema,
      body: updateTheatreAdminAssignmentBodySchema,
    }),
    adapt(controllers.updateTheatreAdminAssignmentController.handle),
  );

  // 7. Revoke/Unassign admin from theatre
  router.delete(
    '/admin-assignments/:assignmentId',
    ...superAdmin,
    validate({ params: revokeTheatreAdminAssignmentParamSchema }),
    adapt(controllers.revokeTheatreAdminAssignmentController.handle),
  );

  // ── Parameterized Route (keep after static routes) ────────────────────────
  router.get(
    '/:theatreId',
    ...theatreAdmin,
    validate({ params: getTheatreOverviewParamSchema }),
    adapt(controllers.getTheatreOverviewController.handle),
  );

  return router;
}
