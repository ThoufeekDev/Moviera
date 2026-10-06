import { Movie } from "../../domain/entities/Movie";

import { PaginatedResult } from "../../../../shared/types/Pagination";

export class MovieResponseMapper {
  static toResponse(movie: Movie) {
    return {
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      languages: movie.languages,
      primaryGenre: movie.primaryGenre,
      genres: movie.genres,
      certification: movie.certification,
      cinemaFormats: movie.cinemaFormats,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      trailerUrl: movie.trailerUrl,
      isActive: movie.isActive,
      cast: movie.cast,
      crew: movie.crew,
    };
  }

  static toListResponse(result: PaginatedResult<Movie>) {
    return {
      items: result.items.map((movie) =>
        MovieResponseMapper.toResponse(movie)
      ),
      pagination: result.pagination,
    };
  }
}