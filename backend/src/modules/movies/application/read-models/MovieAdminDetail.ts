import { Certification } from "../../domain/enums/Certification";

export interface MovieAdminDetail {
  id: string;
  title: string;
  slug: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  certification: Certification;
  description: string | null;
  releaseDate: Date;
  duration: number;
  trailerUrl: string | null;
  isActive: boolean;

  primaryGenre: {
    id: string;
    name: string;
  };

  genres: {
    id: string;
    name: string;
  }[];

  languages: {
    id: string;
    name: string;
  }[];

  theatreFormats: {
    id: string;
    name: string;
  }[];

  cast: {
    id: string;
    personId: string;
    name: string;
    character: string | null;
    profileImageUrl: string | null;
  }[];

  crew: {
    id: string;
    personId: string;
    name: string;
    job: string;
    profileImageUrl: string | null;
  }[];
}