import { Certification } from "../../../../shared/enums/Certification";

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
  certification: Certification;
  cinemaFormatIds:string[]
  posterUrl?: string;
  posterPublicId: string;
  backdropUrl?: string;
  backdropPublicId: string;
  trailerUrl?: string;
}
