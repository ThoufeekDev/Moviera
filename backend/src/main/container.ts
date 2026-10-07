// ! dependancy wireing 

import prisma from "../config/database";
import { buildMoviesModule } from "../modules/movies/movies.module";

export const container = {
    prisma,
    movies: buildMoviesModule(prisma),
}