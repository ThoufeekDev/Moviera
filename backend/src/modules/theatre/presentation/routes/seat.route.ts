import { Router } from "express";

import { buildTheatreModule } from "../../theatre.module";
import { authenticateUser } from "../../../../shared/middleware/authenticateUser";
import { authorizeRoles } from "../../../../shared/middleware/authorizeRoles";
import { Role } from "../../../../shared/enums/Role";
import { validate } from "../../../../shared/middleware/validate";
import { createSeatSchema } from "../validators/CreateSeatValidator";

const router = Router();

const theatreModule = buildTheatreModule();

router.post('/screens/:screenId/seats',authenticateUser,authorizeRoles(Role.THEATRE_ADMIN),validate(createSeatSchema),theatreModule.createSeatController.handle)