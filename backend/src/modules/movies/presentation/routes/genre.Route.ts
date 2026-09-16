import { Router } from "express";
import { buildMoviesModule } from "../../movies.module";

const moviesModule = buildMoviesModule();

const genreRoute = Router();

genreRoute.get(
  "/",
  moviesModule.getGenreController.handle
);

export default genreRoute;