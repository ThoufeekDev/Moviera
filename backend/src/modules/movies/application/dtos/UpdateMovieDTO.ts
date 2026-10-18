import { Certification } from "../../domain/enums/Certification";

export interface UpdateMovieDTO {
  title?: string;
  description?: string | null;
  duration?: number;
  releaseDate?: Date;
  primaryGenreId?: string;
  genreIds?: string[];
  certification?: Certification;
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
  posterFile?: {
    buffer: Buffer;
  };
  backdropFile?: {
    buffer: Buffer;
  };
  trailerUrl?: string | null;
  isActive?: boolean;
}