import { Router } from 'express';
import { GetGenreController } from '../controllers/GetGenreController';

interface GetGenreRouteControllers {
  getGenreController: GetGenreController;
}

export function createGenreRoutes(controllers: GetGenreRouteControllers): Router {
  const genreRoute = Router();

  genreRoute.get('/', controllers.getGenreController.handle);

  return genreRoute;
}
