import { Router } from 'express';

import { GetCinemaFormatController } from '../controllers/GetCinemaFormatController';

interface CinemaFormatRouteController {
  getCinemaFormatController: GetCinemaFormatController;
}

export function createCinemaFormatRoutes(controllers: CinemaFormatRouteController): Router {
  const cinemaFormatRoute = Router();

  cinemaFormatRoute.get('/', controllers.getCinemaFormatController.handle);
  return cinemaFormatRoute;
}
