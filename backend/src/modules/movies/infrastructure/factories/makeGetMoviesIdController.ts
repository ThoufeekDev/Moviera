import { PrismaMovieRepository } from '../PrismaMovieReposiory';
import { GetMovieByIdUseCase } from '../../application/use-cases/GetMovieByIdUseCase';
import { GetMovieByIdController } from '../../presentation/controllers/GetMovieByIdController';
export function makeGetMovieByIdController() {
     const prismaMovieRepository = new PrismaMovieRepository();
     const getMovieByIdUseCase = new GetMovieByIdUseCase(prismaMovieRepository);

     return new GetMovieByIdController(getMovieByIdUseCase);
}
