export interface MovieLanguage {
  id: string;
  name: string;
  code: string;
}

export interface MovieGenre {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface MovieCinemaFormat {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface MovieCastMember {
  id: string;
  character?: string | null;
  person: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

export interface MovieCrewMember {
  id: string;
  job: string;
  person: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
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
  certification: string;
  cinemaFormats: MovieCinemaFormat[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  isActive: boolean;
  cast?: MovieCastMember[];
  crew?: MovieCrewMember[];
}