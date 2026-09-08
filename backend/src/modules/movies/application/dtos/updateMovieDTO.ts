export interface UpdateMovieDTO {
  title?: string;
  description?: string;
  duration?: number;
  releaseDate?: Date;
  language?: string;
  genre?: string;
  certificate?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  isActive?: boolean;
}
