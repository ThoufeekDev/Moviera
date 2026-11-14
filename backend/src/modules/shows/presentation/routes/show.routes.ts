import { Router } from 'express';
import { Role } from '../../../../shared/enums/Role';
import { adapt } from '../../../../shared/http/expressAdapter';
import { authenticateUser } from '../../../../shared/middleware/authenticateUser';
import { authorizeRoles } from '../../../../shared/middleware/authorizeRoles';
import { validate } from '../../../../shared/middleware/validate';
import type { CancelShowController } from '../controllers/CancelShowController';
import type { CreateShowController } from '../controllers/CreateShowController';
import type { GetShowDetailsController } from '../controllers/GetShowDetailsController';
import type { ListShowsController } from '../controllers/ListShowsController';
import type { PublishShowController } from '../controllers/PublishShowController';
import type { UpdateShowController } from '../controllers/UpdateShowController';
import { createShowSchema } from '../schemas/CreateShowSchema';
import { listShowsQuerySchema } from '../schemas/ListShowsSchema';
import {
  showIdParamSchema,
  theatreShowsParamSchema,
} from '../schemas/ShowParamsSchema';
import { updateShowSchema } from '../schemas/UpdateShowSchema';

export interface ShowRouteControllers {
  createShowController: CreateShowController;
  listShowsController: ListShowsController;
  getShowDetailsController: GetShowDetailsController;
  publishShowController: PublishShowController;
  cancelShowController: CancelShowController;
  updateShowController: UpdateShowController;
}

export function createShowRoutes(controllers: ShowRouteControllers): Router {
  const router = Router();
  const showManagers = [
    authenticateUser,
    authorizeRoles(Role.THEATRE_ADMIN, Role.SUPER_ADMIN),
  ];

  router.get(
    '/',
    ...showManagers,
    validate({ query: listShowsQuerySchema }),
    adapt(controllers.listShowsController.handle),
  );

  router.post(
    '/',
    ...showManagers,
    validate({ body: createShowSchema }),
    adapt(controllers.createShowController.handle),
  );

  router.get(
    '/:showId',
    ...showManagers,
    validate({ params: showIdParamSchema }),
    adapt(controllers.getShowDetailsController.handle),
  );

  router.patch(
    '/:showId',
    ...showManagers,
    validate({ params: showIdParamSchema, body: updateShowSchema }),
    adapt(controllers.updateShowController.handle),
  );

  router.put(
    '/:showId',
    ...showManagers,
    validate({ params: showIdParamSchema, body: updateShowSchema }),
    adapt(controllers.updateShowController.handle),
  );

  router.patch(
    '/:showId/publish',
    ...showManagers,
    validate({ params: showIdParamSchema }),
    adapt(controllers.publishShowController.handle),
  );

  router.post(
    '/:showId/publish',
    ...showManagers,
    validate({ params: showIdParamSchema }),
    adapt(controllers.publishShowController.handle),
  );

  router.patch(
    '/:showId/cancel',
    ...showManagers,
    validate({ params: showIdParamSchema }),
    adapt(controllers.cancelShowController.handle),
  );

  router.post(
    '/:showId/cancel',
    ...showManagers,
    validate({ params: showIdParamSchema }),
    adapt(controllers.cancelShowController.handle),
  );

  return router;
}

export function createTheatreShowRoutes(controllers: {
  listShowsController: ListShowsController;
}): Router {
  const router = Router();
  const showManagers = [
    authenticateUser,
    authorizeRoles(Role.THEATRE_ADMIN, Role.SUPER_ADMIN),
  ];

  router.get(
    '/:theatreId/shows',
    ...showManagers,
    validate({
      params: theatreShowsParamSchema,
      query: listShowsQuerySchema,
    }),
    adapt(controllers.listShowsController.handle),
  );

  return router;
}

