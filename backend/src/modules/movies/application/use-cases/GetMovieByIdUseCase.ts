import { NotFoundError } from "../../../../shared/exceptions/NotFoundError";
import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repository/IMovieRepository";



export class GetMovieByIdUseCase {
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(id: string): Promise<Movie | null> {
    const movie = this.movieRepository.findById(id);

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }
}