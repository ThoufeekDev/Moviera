import { Movie as PrismaMovie } from "@prisma/client";
import { Movie } from "../domain/entities/Movie";

export class MovieMapper {
    static toDomain(movie: PrismaMovie): Movie{
        return new Movie(
                  movie.title,
      movie.slug,
      movie.description,
      movie.duration,
      movie.releaseDate,
      movie.language,
      movie.genre,
      movie.certificate,
      movie.posterUrl,
      movie.backdropUrl,
      movie.trailerUrl,
      movie.isActive,
        )
    }


    static toPersistence(movie: Movie) {
        return {
          title: movie.title,
          slug: movie.slug,
          description: movie.description,
          duration: movie.duration,
          releaseDate: movie.releaseDate,
          language: movie.language,
          genre: movie.genre,
          certificate: movie.certificate,
          posterUrl: movie.posterUrl,
          backdropUrl: movie.backdropUrl,
          trailerUrl: movie.trailerUrl,
          isActive: movie.isActive,
        };
    }
}