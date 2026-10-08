import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../validators/CreateMovieValidator";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";

import { upload } from "../../../../shared/middleware/upload.middleware";
import { updateMovieSchema } from "../validators/UpdateMovieValidator";

import { CreateMovieController } from "../controllers/CreateMovieController";
import { GetMovieByIdController } from '../controllers/GetMovieByIdController';
import { GetMovieBySlugController } from "../controllers/GetMovieBySlugController";
import { UpdateMovieController } from "../controllers/UpdateMovieController";


import { ListMoviesForAdminController } from "../controllers/ListMoviesForAdminController";
import { ListMoviesForAdminValidator } from "../validators/ListMoviesForAdminValidator";
import { adapt } from "../../../../shared/http/expressAdapter";
import { GetMovieByIdForAdminController } from '../controllers/GetMovieByIdForAdminController';
interface MovieRouteControllers {
  createMovieController: CreateMovieController;
  getMovieBySlugController: GetMovieBySlugController;
  getMovieByIdForAdminController:GetMovieByIdForAdminController;
  updateMovieController: UpdateMovieController;
  listMoviesForAdminController:ListMoviesForAdminController
}

export function createMovieRoutes(controllers: MovieRouteControllers):Router{
    const movieRoute = Router();

    const admin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN),];
    const files = upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'backdrop', maxCount: 1 }]);
    
  //& Admin
  movieRoute.get('/admin', validate({ query: ListMoviesForAdminValidator }), adapt(controllers.listMoviesForAdminController.execute))
  
   movieRoute.get('/admin/:id',...admin, adapt(controllers.getMovieByIdForAdminController.execute))

    movieRoute.post('/', ...admin, files, validate({ body: createMovieSchema }), controllers.createMovieController.handle)
    
    movieRoute.get('/slug/:slug', controllers.getMovieBySlugController.handle);

   

    movieRoute.patch("/:id",...admin,files,validate({ body: updateMovieSchema }),controllers.updateMovieController.handle);
    
    return movieRoute
}



