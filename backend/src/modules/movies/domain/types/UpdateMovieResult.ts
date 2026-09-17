import { Movie } from "../entities/Movie";

export interface UpdateMovieResult {
  movie: Movie;
  oldPosterPublicId?: string | null;
  oldBackdropPublicId?: string | null;
}

