import { PrismaMovieRepository } from "../Repo/PrismaMovieRepo";
import { GetMovieByIdUseCase } from "../../application/use-cases/GetMovieByIdUseCase";
import { GetMovieByIdController } from "../../presentation/controllers/GetMovieByIdController";


export function makeGetMovieController() {
    const prismaMovieRepository = new PrismaMovieRepository();
    const getMovieByIdUseCase = new GetMovieByIdUseCase(prismaMovieRepository);
      
    return new GetMovieByIdController(getMovieByIdUseCase);
}