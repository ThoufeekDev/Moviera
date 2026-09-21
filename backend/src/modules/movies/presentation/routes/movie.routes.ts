import { Router } from "express";
import { validate } from "../../../../shared/middleware/validate";
import { createMovieSchema } from "../validators/CreateMovieValidator";

import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";

// * Factories
import { buildMoviesModule } from "../../movies.module";

const moviesModule = buildMoviesModule();

import { upload } from "../../../../shared/middleware/upload.middleware";
import { updateMovieSchema } from "../validators/updateMovieValidator";

const movieRoute = Router();



movieRoute.post('/',upload.fields([{ name: "poster", maxCount:1},{name:"backdrop",maxCount:1}]), authenticateUser,authorizeRoles(Role.SUPER_ADMIN),validate(createMovieSchema),moviesModule.createMovieController.handle)
movieRoute.get('/', moviesModule.getMovieController.handle)


movieRoute.get('/:id', moviesModule.getMovieByIdController.handle)
movieRoute.patch('/:id', upload.fields([{ name: "poster", maxCount: 1 },{name:'backdrop',maxCount:1}]),authenticateUser,authorizeRoles(Role.SUPER_ADMIN),validate(updateMovieSchema),moviesModule.updateMovieController.handle)

export default movieRoute;  