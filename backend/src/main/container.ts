// dependency wiring

import prisma from "../config/database";
import { CloudinaryStorageService } from "../shared/infrastructure/storage/CloudinaryStorageService";
import { buildMoviesModule } from "../modules/movies";
import { buildTheatreModule } from "../modules/theatre";
import { buildAuthModule } from "../modules/auth";
import { buildShowsModule } from "../modules/shows";

const storageService = new CloudinaryStorageService();

// ^ Build Movies & Theatre once so other modules can consume their public dependencies.
const moviesModule = buildMoviesModule(prisma, storageService);
const theatreModule = buildTheatreModule(prisma, storageService);
const showsModule = buildShowsModule(prisma, {
  theatreAccessPolicy: theatreModule.theatreAccessPolicy,
  activeScreenSeatReader: theatreModule.activeScreenSeatReader,
  screenDetailsReader: theatreModule.screenDetailsReader,
  movieSchedulingReader: moviesModule.movieSchedulingReader,
});

export const container = {
  prisma,
  storageService,
  movies: moviesModule,
  theatre: theatreModule,
  shows: showsModule,
  auth: buildAuthModule(prisma),
};
