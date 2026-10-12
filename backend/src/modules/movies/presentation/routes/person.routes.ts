import { Router } from 'express';

import { authorizeRoles } from '../../../../shared/middleware/authorizeRoles';
import { Role } from '../../../../shared/enums/Role';
import { authenticateUser } from '../../../../shared/middleware/authenticateUser';
import { upload } from '../../../../shared/middleware/upload.middleware';
import { adapt } from '../../../../shared/http/expressAdapter';
import { validate } from '../../../../shared/middleware/validate';
import { createPersonSchema, getPersonByIdParamSchema } from '../schemas/PersonSchema';

import { CreatePersonController } from '../controllers/CreatePersonController';
import { ListPersonsController } from '../controllers/ListPersonsController';
import { GetPersonByIdController } from '../controllers/GetPersonByIdController';

interface PersonRouteControllers {
  createPersonController: CreatePersonController;
  listPersonsController: ListPersonsController;
  getPersonByIdController: GetPersonByIdController;
}

export function createPersonRoutes(controllers: PersonRouteControllers): Router {
  const personRoutes = Router();

  const admin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN)];
  const image = upload.single('image');

  personRoutes.post(
    '/',
    ...admin,
    image,
    validate({ body: createPersonSchema }),
    adapt(controllers.createPersonController.handle),
  );

  personRoutes.get('/', adapt(controllers.listPersonsController.handle));

  personRoutes.get(
    '/:id',
    validate({ params: getPersonByIdParamSchema }),
    adapt(controllers.getPersonByIdController.handle),
  );

  return personRoutes;
}
