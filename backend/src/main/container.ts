// dependency wiring

import prisma from "../config/database";
import { CloudinaryStorageService } from "../shared/infrastructure/storage/CloudinaryStorageService";
import { buildMoviesModule } from "../modules/movies";
import { buildTheatreModule } from "../modules/theatre";
import { buildAuthModule } from "../modules/auth";

const storageService = new CloudinaryStorageService();

export const container = {
  prisma,
  storageService,
  movies: buildMoviesModule(prisma, storageService),
  theatre: buildTheatreModule(prisma, storageService),
  auth: buildAuthModule(prisma),
};