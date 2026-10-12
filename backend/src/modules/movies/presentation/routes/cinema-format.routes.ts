import { Router } from 'express';
import { adapt } from '../../../../shared/http/expressAdapter';
import { ListCinemaFormatsController } from '../controllers/ListCinemaFormatsController';

interface CinemaFormatRouteController {
  listCinemaFormatsController: ListCinemaFormatsController;
}

export function createCinemaFormatRoutes(controllers: CinemaFormatRouteController): Router {
  const cinemaFormatRoute = Router();

  cinemaFormatRoute.get('/', adapt(controllers.listCinemaFormatsController.handle));
  return cinemaFormatRoute;
}
