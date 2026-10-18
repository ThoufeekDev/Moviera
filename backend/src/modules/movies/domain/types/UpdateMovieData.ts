import { Certification } from "../enums/Certification";

export interface UpdateMovieData {
  title?: string;
  slug?: string;
  description?: string | null;
  duration?: number;
  releaseDate?: Date;
  primaryGenreId?: string;
  genreIds?: string[];
  certification?: Certification;

  posterUrl?: string | null;
  posterPublicId?: string;
  backdropUrl?: string | null;
  backdropPublicId?: string;
  trailerUrl?: string | null;

  isActive?: boolean;

  languageIds?: string[];

  theatreFormatIds?: string[];

  cast?: {
    personId: string;
    character?: string | null;
  }[];

  crew?: {
    personId: string;
    job: string;
  }[];
}