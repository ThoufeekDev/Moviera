import { Router } from 'express';
import { adapt } from '../../../../shared/http/expressAdapter';
import { GetGenreController } from '../controllers/GetGenreController';

interface GetGenreRouteControllers {
  getGenreController: GetGenreController;
}

export function createGenreRoutes(controllers: GetGenreRouteControllers): Router {
  const genreRoute = Router();

  genreRoute.get('/', adapt(controllers.getGenreController.handle));

  return genreRoute;
}
