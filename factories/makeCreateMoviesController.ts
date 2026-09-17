import { CreateMovieController } from "../../presentation/controllers/CreateMovieController";
import { CreateMovieUseCase } from "../../application/use-cases/CreateMovieUseCase";
import { PrismaMovieRepository } from "../Repo/PrismaMovieRepo";
import { CloudinaryService } from "../../../../shared/services/cloudinary.service";
import { PrismaGenreRepository } from "../Repo/PrismaGenreRepo";
import { PrismaLanguageRepository } from "../Repo/PrismaLanguageRepo";
import { PrismaCinemaFormatRepository } from "../Repo/PrismaCinemaFormatRepo";
export function makeCreateMovieController() {
    const movieRepository = new PrismaMovieRepository();
    const genreRepository = new PrismaGenreRepository()
    const languageRepository = new PrismaLanguageRepository();
    const cinemaFormatRepository = new PrismaCinemaFormatRepository()
    const createMovieUseCase = new CreateMovieUseCase(
        movieRepository,
        genreRepository,
        languageRepository,
        cinemaFormatRepository
    );
    const cloudinaryService = new CloudinaryService()
   return new CreateMovieController(createMovieUseCase,cloudinaryService);

}