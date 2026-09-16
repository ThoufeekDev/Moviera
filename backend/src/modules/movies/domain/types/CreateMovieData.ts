import { Certification } from "../../../../shared/enums/Certification";

export interface CreateMovieData {
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  releaseDate: Date;
  primaryGenreId: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  isActive: boolean;

  languageIds: string[];
  cinemaFormatIds: string[];
  certification:Certification

  cast: {
    personId: string;
    character?: string;
  }[];

  crew: {
    personId: string;
    job: string;
  }[];
}
