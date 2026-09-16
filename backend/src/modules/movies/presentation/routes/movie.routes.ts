import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../validators/CreateMovieValidator";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";

// * Factories
import { buildMoviesModule } from "../../movies.module";

const moviesModule = buildMoviesModule();


// import { makeCreateMovieController } from '../../infrastructure/factories/makeCreateMoviesController';
// import { makeGetMovieController } from "../../infrastructure/factories/makeGetMoviesController";
// import { makeGetMovieByIdController } from "../../infrastructure/factories/makeGetMoviesIdController";
// import { makeUpdateMovieController } from "../../infrastructure/factories/makeUpdateMoviesController";
// import { updateMovieSchema } from "../validators/updateMovieValidator";
import { upload } from "../../../../shared/middleware/upload.middleware";

const movieRoute = Router();

// const createMovieController = makeCreateMovieController();
// const getMovieController = makeGetMovieController();
// const getMovieByIdController = makeGetMovieByIdController();
// const getUpdateMovieController = makeUpdateMovieController();

console.log("trigger server");

movieRoute.post('/',upload.fields([{ name: "poster", maxCount:1},{name:"backdrop",maxCount:1}]), validate(createMovieSchema),moviesModule.createMovieController.handle)
movieRoute.get('/', moviesModule.getMovieController.handle)


movieRoute.get('/:id', moviesModule.getMovieByIdController.handle)
// movieRoute.patch('/:id',moviesModule.getUpdateMovieController.handle)

export default movieRoute;