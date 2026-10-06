import { buildMoviesModule } from "../../movies.module";
import { Router } from "express";
const moviesModule = buildMoviesModule();


const cinemaFormatRoute = Router()

cinemaFormatRoute.get('/', moviesModule.getCinemaFormatController.handle)

export default cinemaFormatRoute;