import { CreateMovieController } from "../../presentation/controllers/CreateMovieController";
import { CreateMovieUseCase } from "../../application/use-cases/CreateMovieUseCase";
import { PrismaMovieRepository } from "../Repo/PrismaMovieRepo";
import { CloudinaryService } from "../../../../shared/services/cloudinary.service";


export function makeCreateMovieController() {
    const prismaMovieRepository = new PrismaMovieRepository();
    const createMovieUseCase = new CreateMovieUseCase(prismaMovieRepository);
    const cloudinaryService = new CloudinaryService()
   return new CreateMovieController(createMovieUseCase,cloudinaryService);

}