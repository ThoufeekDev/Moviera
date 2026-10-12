import type { Genre, Language, CinemaFormat } from './referenceData.types';

export type MovieLanguage = Language;
export type MovieGenre = Genre;
export type MovieCinemaFormat = CinemaFormat;

export interface MovieCastMember {
  id: string;
  personId: string;
  name: string;
  character: string | null;
  profileImageUrl: string | null;
}

export interface MovieCrewMember {
  id: string;
  personId: string;
  name: string;
  job: string;
  profileImageUrl: string | null;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  releaseDate: string;
  languages: MovieLanguage[];
  primaryGenre: MovieGenre;
  genres:MovieGenre[],
  certification: string;
  cinemaFormats: MovieCinemaFormat[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  isActive: boolean;
  cast?: MovieCastMember[];
  crew?: MovieCrewMember[];
}