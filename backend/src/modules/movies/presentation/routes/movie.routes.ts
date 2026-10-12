import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../schemas/CreateMovieSchema";
import { updateMovieSchema } from "../schemas/UpdateMovieSchema";
import { listMoviesForAdminSchema } from "../schemas/ListMoviesForAdminSchema";
import { getMovieBySlugParamSchema, getMovieByIdParamSchema } from "../schemas/MovieParamsSchema";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { upload } from "../../../../shared/middleware/upload.middleware";
import { adapt } from "../../../../shared/http/expressAdapter";

import { CreateMovieController } from "../controllers/CreateMovieController";
import { ListMoviesForAdminController } from "../controllers/ListMoviesForAdminController";
import { GetMovieByIdForAdminController } from "../controllers/GetMovieByIdForAdminController";
import { GetMovieBySlugForAdminController } from "../controllers/GetMovieBySlugForAdminController";
import { UpdateMovieController } from "../controllers/UpdateMovieController";

interface MovieRouteControllers {
  createMovieController: CreateMovieController;
  getMovieBySlugForAdminController: GetMovieBySlugForAdminController;
  getMovieByIdForAdminController: GetMovieByIdForAdminController;
  updateMovieController: UpdateMovieController;
  listMoviesForAdminController: ListMoviesForAdminController;
}

export function createMovieRoutes(controllers: MovieRouteControllers): Router {
  const movieRoute = Router();

  const admin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN)];
  const files = upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'backdrop', maxCount: 1 },
  ]);

  // Admin routes
  movieRoute.get(
    '/admin',
    ...admin,
    validate({ query: listMoviesForAdminSchema }),
    adapt(controllers.listMoviesForAdminController.handle),
  );

  movieRoute.get(
    '/admin/slug/:slug',
    ...admin,
    validate({ params: getMovieBySlugParamSchema }),
    adapt(controllers.getMovieBySlugForAdminController.handle),
  );

  movieRoute.get(
    '/admin/:id',
    ...admin,
    validate({ params: getMovieByIdParamSchema }),
    adapt(controllers.getMovieByIdForAdminController.handle),
  );

  movieRoute.post(
    '/',
    ...admin,
    files,
    validate({ body: createMovieSchema }),
    adapt(controllers.createMovieController.handle),
  );

  movieRoute.patch(
    '/:id',
    ...admin,
    files,
    validate({ params: getMovieByIdParamSchema, body: updateMovieSchema }),
    adapt(controllers.updateMovieController.handle),
  );

  return movieRoute;
}
