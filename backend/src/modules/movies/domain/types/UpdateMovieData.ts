import { Certification } from "../../../../shared/enums/Certification";

export interface UpdateMovieData {
  title?: string;
  slug?: string;
  description?: string | null;
  duration?: number;
  releaseDate?: Date;
  primaryGenreId?: string;
  certification?: Certification;

  posterUrl?: string | null;
  posterPublicId?: string;
  backdropUrl?: string | null;
  backdropPublicId?: string;
  trailerUrl?: string | null;

  isActive?: boolean;

  languageIds?: string[];

  cinemaFormatIds?: string[];

  cast?: {
    personId: string;
    character?: string;
  }[];

  crew?: {
    personId: string;
    job: string;
  }[];
}