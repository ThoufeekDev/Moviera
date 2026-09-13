export interface CreateMovieData {
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  releaseDate: Date;
  genre: string;
  certificate: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  isActive: boolean;

  languages: string[];

  cast: {
    personId: string;
    character?: string;
  }[];

  crew: {
    personId: string;
    job: string;
  }[];
}
