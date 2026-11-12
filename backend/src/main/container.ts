// dependency wiring

import prisma from "../config/database";
import { CloudinaryStorageService } from "../shared/infrastructure/storage/CloudinaryStorageService";
import { buildMoviesModule } from "../modules/movies";
import { buildTheatreModule } from "../modules/theatre";
import { buildAuthModule } from "../modules/auth";

const storageService = new CloudinaryStorageService();


// ^ Build Theatre once so other modules can consume its public dependencies.
const theatreModule = buildTheatreModule(prisma, storageService);

export const container = {
  prisma,
  storageService,
  movies: buildMoviesModule(prisma, storageService),
  theatre: theatreModule,
  auth: buildAuthModule(prisma),
};