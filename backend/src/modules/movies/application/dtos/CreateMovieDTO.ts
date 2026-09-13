export interface CreateMovieDTO {
  title: string;
  description?: string;
  duration: number;
  releaseDate: Date;
  languages: string[];
  cast: {
    personId: string;
    character?: string;

  }[];

  crew: {
    personId: string;
    job: string;
  }[];
  genre: string;
  certificate: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
}
