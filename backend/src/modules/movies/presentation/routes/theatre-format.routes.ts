import { Router } from 'express';
import { adapt } from '../../../../shared/http/expressAdapter';
import { ListTheatreFormatsController } from '../controllers/ListTheatreFormatsController';

interface TheatreFormatRouteController {
  listTheatreFormatsController: ListTheatreFormatsController;
}

export function createTheatreFormatRoutes(controllers: TheatreFormatRouteController): Router {
  const theatreFormatRoute = Router();

  theatreFormatRoute.get('/', adapt(controllers.listTheatreFormatsController.handle));
  return theatreFormatRoute;
}
