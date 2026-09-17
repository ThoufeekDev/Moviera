import { PrismaMovieRepository } from "../Repo/PrismaMovieRepo";
import { UpdateMovieUseCase } from "../../application/use-cases/UpdateMovieUseCase";
import { UpdateMovieController } from "../../presentation/controllers/UpdateMovieController";



export function makeUpdateMovieController() {
    const movieRepository = new PrismaMovieRepository();
    const updateMovieUseCase = new UpdateMovieUseCase(movieRepository);

    return new UpdateMovieController(updateMovieUseCase)

}