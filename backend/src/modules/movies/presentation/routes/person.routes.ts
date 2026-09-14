import { Router } from "express";
import { makeCreatePersonController } from "../../infrastructure/factories/makeCreatePersonController";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import {upload} from "../../../../shared/middleware/upload.middleware"
import { makeGetPersonController } from "../../infrastructure/factories/makeGetPersonController";
import { makeGetPersonByIdController } from "../../infrastructure/factories/makeGetPersonByIdController";


const personRoutes = Router();


const createPersonController = makeCreatePersonController();
const getPersonController = makeGetPersonController();
const getPersonByIdController = makeGetPersonByIdController();
personRoutes.post('/', upload.single("image"), createPersonController.handle);
personRoutes.get('/',getPersonController.handle)
personRoutes.get('/:id',getPersonByIdController.handle)
export default personRoutes;