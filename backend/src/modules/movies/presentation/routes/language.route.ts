import { Router } from "express";
import { buildMoviesModule } from "../../movies.module";
const moviesModule = buildMoviesModule();

const languageRoute = Router();

// const getLanguageController = makeGetLanguageContoller();


// !for Testing authourize and athenticate middleware were not used

languageRoute.get('/',moviesModule.getLanguageController.handle)


export default languageRoute;

