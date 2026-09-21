import type { Certification } from "../../../../../shared/constants/Certification";
export interface MovieFormValues {
  title: string;
  description: string;
  duration: unknown;
  releaseDate: string;
  primaryGenreId: string;
  certificate: Certification;
  languages: string[];
  cinemaFormatIds: string[];

  poster?: File;
  backdrop?: File;

  cast: {
    personId: string;
    character?: string;
  }[];

  crew: {
    personId: string;
    job: string;
  }[];

  trailerUrl?: string;
}