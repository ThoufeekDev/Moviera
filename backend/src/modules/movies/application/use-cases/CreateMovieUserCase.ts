import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repository/IMovieRepository";
import { CreateMovieDTO } from "../dtos/CreateMovieDTO";


export class CreateMovieUseCase {
  // I need a movie repository. Give me one.
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(data: CreateMovieDTO): Promise<Movie | null> {
    /** 
         * * finding is that movie exist or not
         
         */

    const slug = data.title.toLowerCase().trim().replace(/\s+/g, '-');
    const existingMovie = await this.movieRepository.findBySlug(data.title);

    if (existingMovie) {
      new ConflictError('Movie already exists');
    }

    const movie = new Movie(
      data.title,
      slug,
      data.description ?? null,
      data.duration,
      data.releaseDate,
      data.language,
      data.genre,
      data.certificate,
      data.posterUrl ?? null,
      data.backdropUrl ?? null,
      data.trailerUrl ?? null,
      true,
    );

    return this.movieRepository.create(movie);
  }
}