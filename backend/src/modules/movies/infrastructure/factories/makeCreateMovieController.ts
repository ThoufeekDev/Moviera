import { CreateMovieController } from "../../presentation/controllers/CreateMovieController";
import { CreateMovieUseCase } from "../../application/use-cases/CreateMovieUserCase";
import { PrismaMovieRepository } from "../PrismaMovieReposiory";



export function makeCreateMovieController() {
    const prismaMovieRepository = new PrismaMovieRepository();
    const createMovieUseCase = new CreateMovieUseCase(prismaMovieRepository);
   return new CreateMovieController(createMovieUseCase);

}