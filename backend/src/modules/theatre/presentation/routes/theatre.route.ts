import { Router } from "express";

import { buildTheatreModule } from "../../theatre.module";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { validate } from "../../../../shared/middleware/validate";
import { createScreenSchema } from "../validators/CreateScreenValidator";
import type { TheatreParams } from "../controllers/GetTheatreOverviewController";
const router = Router();


const theatreModule = buildTheatreModule();


router.get('/my-theatres',authenticateUser,authorizeRoles(Role.THEATRE_ADMIN),theatreModule.getMyTheatresController.handle)
router.post('/screens', authenticateUser,authorizeRoles(Role.THEATRE_ADMIN),validate(createScreenSchema), theatreModule.createScreenController.handle)
router.get('/:theatreId',authenticateUser,authorizeRoles(Role.THEATRE_ADMIN),theatreModule.getTheatreOverViewController.handle)
export default router;