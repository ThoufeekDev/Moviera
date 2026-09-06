import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../validators/CreateMovieValidator";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";



// Factories 

import { makeCreateMovieController } from '../../infrastructure/factories/makeCreateMovieController';
import { makeGetMovieController } from "../../infrastructure/factories/makeGetMoviesController";
import { makeGetMovieByIdController } from "../../infrastructure/factories/makeGetMovieIdController";
const movieRoute = Router();

const createMovieController = makeCreateMovieController();
const getMovieController = makeGetMovieController();
const getMovieByIdController = makeGetMovieByIdController();
movieRoute.post('/',authenticateUser,authorizeRoles(Role.SUPER_ADMIN), validate(createMovieSchema), createMovieController.handle)
movieRoute.get('/', getMovieController.handle)
movieRoute.get('/:id',getMovieByIdController.handle)

export default movieRoute;