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

  posterFile?: {
    buffer: Buffer;
  };

  backdropFile?: {
    buffer: Buffer;
  };

  trailerUrl?: string;

  isActive?: boolean;
}