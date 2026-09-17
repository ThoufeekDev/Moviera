import { Certification } from "../../../../shared/enums/Certification";

export interface UpdateMovieDTO {
  title?: string;
  description?: string;
  duration?: number;
  releaseDate?: Date;

  primaryGenreId?: string;
  certification?: Certification;

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

  posterUrl?: string;
  posterPublicId?: string;
  backdropUrl?: string;
  backdropPublicId?: string;
  trailerUrl?: string;

  isActive?: boolean;
}