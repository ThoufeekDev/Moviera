import { Router } from "express";
import { makeGetLanguageContoller } from "../../infrastructure/factories/makeGetLanguageController";


const languageRoute = Router();
const getLanguageController = makeGetLanguageContoller();


// !for Testing authourize and athenticate middleware were not used
languageRoute.get('/',getLanguageController.handle)


export default languageRoute;

