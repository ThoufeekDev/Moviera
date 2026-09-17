import { Language } from './Language';
import { MovieCast } from './MovieCast';
import { MovieCrew } from './MovieCrew';
import { Genre } from './Genre';
import { CinemaFormat } from './CinemaFormat';
import { Certification } from '../../../../shared/enums/Certification';
export class Movie {
  constructor(
    public readonly title: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly duration: number,
    public readonly releaseDate: Date,
    public readonly languages: Language[],
    public readonly primaryGenre: Genre,
     public readonly certification: Certification,
    public readonly cinemaFormats:CinemaFormat[],
    public readonly posterUrl: string | null,
    public readonly posterPublicId: string | null,
    public readonly backdropUrl: string | null,
    public readonly backdropPublicId: string | null,
    public readonly trailerUrl: string | null,
    public readonly isActive: boolean,
    public readonly cast: MovieCast[],
    public readonly crew: MovieCrew[],
  ) {}
}