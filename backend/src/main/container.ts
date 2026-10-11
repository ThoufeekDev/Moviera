// dependency wiring

import prisma from "../config/database";
import { CloudinaryStorageService } from "../shared/infrastructure/storage/CloudinaryStorageService";
import { buildMoviesModule } from "../modules/movies";

const storageService = new CloudinaryStorageService();

export const container = {
    prisma,
    storageService,
    movies: buildMoviesModule(prisma, storageService),
};