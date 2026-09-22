import { Movie } from '../../domain/entities/Movie';

export interface PaginatedMovies {
  movies: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}