export class Movie {
  constructor(
    public title: string,
    public slug: string,
    public description: string | null,
    public duration: number,
    public releaseDate: Date,
    public language: string,
    public genre: string,
    public certificate: string,
    public posterUrl: string | null,
    public backdropUrl: string | null,
    public trailerUrl: string | null,
    public isActive: boolean,
  ) {}
}
