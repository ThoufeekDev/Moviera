import { Router } from "express";
import { GetLanguageController } from "../controllers/GetLanguageController";


interface LanguageRouteControllers {
  getLanguageController:GetLanguageController
}

export function createLanguageRoutes(controllers: LanguageRouteControllers):Router {
    
    const languageRoute = Router()

    languageRoute.get('/', controllers.getLanguageController.handle)
    
    return languageRoute;
}





