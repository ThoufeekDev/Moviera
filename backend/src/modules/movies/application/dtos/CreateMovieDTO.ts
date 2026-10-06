import { Certification } from "../../domain/enums/Certification";

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
  primaryGenreId: string;
  genreIds:string[]
  certification: Certification;
  cinemaFormatIds:string[]
  trailerUrl?: string;
  posterFile?: {
    buffer: Buffer;
  }
  backdropFile?: {
    buffer:Buffer
  }
}
