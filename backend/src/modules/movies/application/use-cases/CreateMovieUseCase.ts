import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repository/IMovieRepository";
import { CreateMovieDTO } from "../dtos/CreateMovieDTO";
import { CreateMovieData } from "../../domain/repository/CreateMovieData";

export class CreateMovieUseCase {
  // I need a movie repository. Give me one.
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(data: CreateMovieDTO): Promise<Movie | null> {
    /** 
         * * finding is that movie exist or not
         
         */

    const slug = data.title.toLowerCase().trim().replace(/\s+/g, '-');
    const existingMovie = await this.movieRepository.findBySlug(slug);

    if (existingMovie) {
      throw new ConflictError('Movie already exists');
    }

   // ! commended  for testing purpouse
    //      const movie = new Movie(
    //   data.title,
    //   slug,
    //   data.description ?? null,
    //   data.duration,
    //   data.releaseDate,
    //  languages: data.languages,
    //   data.genre,
    //   data.certificate,
    //   data.posterUrl ?? null,
    //   data.backdropUrl ?? null,
    //   data.trailerUrl ?? null,
    //   true,
    //   crew,
    //   cast
    // );

    // return this.movieRepository.create(movie);

    const movieData: CreateMovieData = {
      title: data.title,
      slug,
      description: data.description ?? null,
      duration: data.duration,
      releaseDate: data.releaseDate,
      genre: data.genre,
      certificate: data.certificate,
      posterUrl: data.posterUrl ?? null,
      backdropUrl: data.backdropUrl ?? null,
      trailerUrl: data.trailerUrl ?? null,
      isActive: true,

      languages: data.languages,

      cast: data.cast,

      crew: data.crew,
    };

    return this.movieRepository.create(movieData);
  }
}