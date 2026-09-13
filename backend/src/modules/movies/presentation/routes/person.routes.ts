import { Router } from "express";
import { makeCreatePersonController } from "../../infrastructure/factories/makeCreatePersonController";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import {upload} from "../../../../shared/middleware/upload.middleware"


const personRoutes = Router();


const createPersonController = makeCreatePersonController();

personRoutes.post('/',upload.single("image"), createPersonController.handle);

export default personRoutes;