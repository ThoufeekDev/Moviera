import { Router } from 'express';
import { adapt } from '../../../../shared/http/expressAdapter';
import { GetCinemaFormatController } from '../controllers/GetCinemaFormatController';

interface CinemaFormatRouteController {
  getCinemaFormatController: GetCinemaFormatController;
}

export function createCinemaFormatRoutes(controllers: CinemaFormatRouteController): Router {
  const cinemaFormatRoute = Router();

  cinemaFormatRoute.get('/', adapt(controllers.getCinemaFormatController.handle));
  return cinemaFormatRoute;
}
