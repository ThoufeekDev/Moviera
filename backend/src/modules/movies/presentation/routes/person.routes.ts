import { Router } from 'express';

import { authorizeRoles } from '../../../../shared/middleware/authorizeRoles';
import { Role } from '../../../../shared/enums/Role';
import { authenticateUser } from '../../../../shared/middleware/authenticateUser';
import { upload } from '../../../../shared/middleware/upload.middleware';

import { CreatePersonController } from '../controllers/CreatePersonController';
import { GetPersonController } from '../controllers/GetPersonController';
import { GetPersonByIdController } from '../controllers/GetPersonByIdController';

interface PersonRouteControllers {
  createPersonController: CreatePersonController;
  getPersonController: GetPersonController;
  getPersonByIdController: GetPersonByIdController;
}

export function createPersonRoutes(controllers: PersonRouteControllers): Router {
  const personRoutes = Router();

  const admin = [authenticateUser, authorizeRoles(Role.SUPER_ADMIN)];
  const image = upload.single('image');

  personRoutes.post('/', ...admin, image, controllers.createPersonController.handle);

  personRoutes.get('/', controllers.getPersonController.handle);

    personRoutes.get('/:id', controllers.getPersonByIdController.handle);
    
  return personRoutes;
}
