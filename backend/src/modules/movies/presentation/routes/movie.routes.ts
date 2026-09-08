import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../validators/CreateMovieValidator";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";



// Factories 

import { makeCreateMovieController } from '../../infrastructure/factories/makeCreateMoviesController';
import { makeGetMovieController } from "../../infrastructure/factories/makeGetMoviesController";
import { makeGetMovieByIdController } from "../../infrastructure/factories/makeGetMoviesIdController";
import { makeUpdateMovieController } from "../../infrastructure/factories/makeUpdateMoviesController";
import { updateMovieSchema } from "../validators/updateMovieValidator";

const movieRoute = Router();

const createMovieController = makeCreateMovieController();
const getMovieController = makeGetMovieController();
const getMovieByIdController = makeGetMovieByIdController();
const getUpdateMovieController = makeUpdateMovieController();




movieRoute.post('/',authenticateUser,authorizeRoles(Role.SUPER_ADMIN), validate(createMovieSchema), createMovieController.handle)
movieRoute.get('/', getMovieController.handle)
movieRoute.get('/:id', getMovieByIdController.handle)
movieRoute.patch('/:id',getUpdateMovieController.handle)

export default movieRoute;