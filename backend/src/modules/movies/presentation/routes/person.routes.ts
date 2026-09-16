import { Router } from "express";

import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import {upload} from "../../../../shared/middleware/upload.middleware"
// import { makeGetPersonController } from "../../infrastructure/factories/makeGetPersonController";
// import { makeGetPersonByIdController } from "../../infrastructure/factories/makeGetPersonByIdController";
//import { makeCreatePersonController } from "../../infrastructure/factories/makeCreatePersonController";
import { buildMoviesModule } from "../../movies.module";
const moviesModule = buildMoviesModule();

const personRoutes = Router();


// const createPersonController = makeCreatePersonController();
// const getPersonController = makeGetPersonController();
// const getPersonByIdController = makeGetPersonByIdController();
personRoutes.post('/', upload.single("image"),moviesModule.createPersonController.handle);
personRoutes.get('/',moviesModule.getPersonController.handle)
personRoutes.get('/:id',moviesModule.getPersonByIdController.handle)
export default personRoutes;