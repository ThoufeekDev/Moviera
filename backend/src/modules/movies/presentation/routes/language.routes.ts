import { Router } from "express";
import { adapt } from "../../../../shared/http/expressAdapter";
import { GetLanguageController } from "../controllers/GetLanguageController";

interface LanguageRouteControllers {
  getLanguageController: GetLanguageController;
}

export function createLanguageRoutes(controllers: LanguageRouteControllers): Router {
  const languageRoute = Router();

  languageRoute.get('/', adapt(controllers.getLanguageController.handle));

  return languageRoute;
}
