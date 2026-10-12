import { Language } from './Language';
import { Genre } from './Genre';
import { CinemaFormat } from './CinemaFormat';
import { Certification } from '../enums/Certification';
import { CastMember } from '../value-objects/CastMember';
import { CrewMember } from '../value-objects/CrewMember';
import { ImageRef } from '../value-objects/ImageRef';
export class Movie {
  constructor(
    public readonly id:string,
    public readonly title: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly duration: number,
    public readonly releaseDate: Date,
    public readonly languages: Language[],
    public readonly primaryGenre: Genre,
    public readonly genres:Genre[],
    public readonly certification: Certification,
    public readonly cinemaFormats:CinemaFormat[],
    public readonly poster: ImageRef | null,
    public readonly backdrop: ImageRef | null,
    public readonly trailerUrl: string | null,
    public readonly isActive: boolean,
    public readonly cast: CastMember[],
    public readonly crew: CrewMember[],
  ) {}
}