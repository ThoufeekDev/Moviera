import { Language } from './Language';
import { MovieCast } from './MovieCast';
import { MovieCrew } from './MovieCrew';
export class Movie {
  constructor(
    public readonly title: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly duration: number,
    public readonly releaseDate: Date,
    public readonly languages: Language[],
    public readonly genre: string,
    public readonly certificate: string,
    public readonly posterUrl: string | null,
    public readonly backdropUrl: string | null,
    public readonly trailerUrl: string | null,
    public readonly isActive: boolean,
    public readonly cast: MovieCast[],
    public readonly crew: MovieCrew[],
  ) {}
}