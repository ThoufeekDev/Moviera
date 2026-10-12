import { Router } from "express";
import { adapt } from "../../../../shared/http/expressAdapter";
import { ListLanguagesController } from "../controllers/ListLanguagesController";

interface LanguageRouteControllers {
  listLanguagesController: ListLanguagesController;
}

export function createLanguageRoutes(controllers: LanguageRouteControllers): Router {
  const languageRoute = Router();

  languageRoute.get('/', adapt(controllers.listLanguagesController.handle));

  return languageRoute;
}
