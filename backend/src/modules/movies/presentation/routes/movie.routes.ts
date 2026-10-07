import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../validators/CreateMovieValidator";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";

// * Factories
// import { buildMoviesModule } from "../../movies.module";

// const moviesModule = buildMoviesModule();

import { upload } from "../../../../shared/middleware/upload.middleware";
import { updateMovieSchema } from "../validators/UpdateMovieValidator";
import { GetMovieController } from "../controllers/GetMovieController";
import { CreateMovieController } from "../controllers/CreateMovieController";
import { GetMovieByIdController } from '../controllers/GetMovieByIdController';
import { GetMovieBySlugController } from "../controllers/GetMovieBySlugController";
import { UpdateMovieController } from "../controllers/UpdateMovieController";

interface MovieRouteControllers {
  getMovieController: GetMovieController;
  createMovieController: CreateMovieController;
  getMovieBySlugController: GetMovieBySlugController;
  getMovieByIdController: GetMovieByIdController;
  updateMovieController: UpdateMovieController;
}

export function createMovieRoutes(controllers: MovieRouteControllers):Router{
    const movieRoute = Router();

    const admin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN),];
    const files = upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'backdrop', maxCount: 1 }]);

    movieRoute.get('/', controllers.getMovieController.handle)

    movieRoute.post('/', ...admin, files, validate({ body: createMovieSchema }), controllers.createMovieController.handle)
    
    movieRoute.get('/slug/:slug', controllers.getMovieBySlugController.handle);

    movieRoute.get('/:id', controllers.getMovieByIdController.handle)

    movieRoute.patch("/:id",...admin,files,validate({ body: updateMovieSchema }),controllers.updateMovieController.handle);
    
    return movieRoute
}


