import { Router } from 'express';
import { adapt } from '../../../../shared/http/expressAdapter';
import { ListGenresController } from '../controllers/ListGenresController';

interface GenreRouteControllers {
  listGenresController: ListGenresController;
}

export function createGenreRoutes(controllers: GenreRouteControllers): Router {
  const genreRoute = Router();

  genreRoute.get('/', adapt(controllers.listGenresController.handle));

  return genreRoute;
}
