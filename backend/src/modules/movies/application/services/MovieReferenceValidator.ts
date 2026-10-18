import { CreateMovieDTO } from "../dtos/CreateMovieDTO";
import { UpdateMovieDTO } from "../dtos/UpdateMovieDTO";
import { Movie } from "../../domain/entities/Movie";
import { IGenreRepository } from "../../domain/repositories/IGenreRepository";
import { ILanguageRepository } from "../../domain/repositories/ILanguageRepository";
import { ITheatreFormatRepository } from "../../domain/repositories/ITheatreFormatRepository";
import { IPersonRepository } from "../../domain/repositories/IPersonRepository";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";

export class MovieReferenceValidator {
  constructor(
    private readonly genreRepository: IGenreRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly theatreFormatRepository: ITheatreFormatRepository,
    private readonly personRepository: IPersonRepository,
  ) {}

  async validateForCreate(movie: CreateMovieDTO): Promise<void> {
    const personIds = [
      ...movie.cast.map((item) => item.personId),
      ...movie.crew.map((item) => item.personId),
    ];

    const uniquePersonIds = [...new Set(personIds)];

    const [genres, languages, theatreFormats, persons] = await Promise.all([
      this.genreRepository.findByIds(movie.genreIds),
      this.languageRepository.findByIds(movie.languageIds),
      this.theatreFormatRepository.findByIds(movie.theatreFormatIds),
      uniquePersonIds.length > 0
        ? this.personRepository.findByIds(uniquePersonIds)
        : Promise.resolve([]),
    ]);

    if (genres.length !== movie.genreIds.length) {
      throw new BadRequestError('One or more genres are invalid or inactive');
    }

    if (!movie.genreIds.includes(movie.primaryGenreId)) {
      throw new BadRequestError('Primary genre must be included in genreIds');
    }

    if (languages.length !== movie.languageIds.length) {
      throw new BadRequestError('One or more languages are invalid');
    }

    if (theatreFormats.length !== movie.theatreFormatIds.length) {
      throw new BadRequestError('One or more theatre formats are invalid or inactive');
    }

    if (persons.length !== uniquePersonIds.length) {
      throw new BadRequestError('One or more cast or crew persons are invalid');
    }
  }

  async validateForUpdate(movie: UpdateMovieDTO, existingMovie: Movie): Promise<void> {
    if (movie.genreIds) {
      const genres = await this.genreRepository.findByIds(movie.genreIds);

      if (genres.length !== movie.genreIds.length) {
        throw new BadRequestError('One or more genres are invalid or inactive');
      }

      const primaryGenreId = movie.primaryGenreId ?? existingMovie.primaryGenre.id;

      if (!movie.genreIds.includes(primaryGenreId)) {
        throw new BadRequestError('Primary genre must be included in genreIds');
      }
    } else if (movie.primaryGenreId) {
      const currentGenreIds = existingMovie.genres.map((genre) => genre.id);

      if (!currentGenreIds.includes(movie.primaryGenreId)) {
        throw new BadRequestError('Primary genre must already belong to the movie genres');
      }
    }

    const personIds = [
      ...(movie.cast?.map((item) => item.personId) ?? []),
      ...(movie.crew?.map((item) => item.personId) ?? []),
    ];

    const uniquePersonIds = [...new Set(personIds)];

    const [languages, theatreFormats, persons] = await Promise.all([
      movie.languageIds
        ? this.languageRepository.findByIds(movie.languageIds)
        : Promise.resolve([]),

      movie.theatreFormatIds
        ? this.theatreFormatRepository.findByIds(movie.theatreFormatIds)
        : Promise.resolve([]),

      uniquePersonIds.length > 0
        ? this.personRepository.findByIds(uniquePersonIds)
        : Promise.resolve([]),
    ]);

    if (movie.languageIds && languages.length !== movie.languageIds.length) {
      throw new BadRequestError('One or more languages are invalid');
    }

    if (movie.theatreFormatIds && theatreFormats.length !== movie.theatreFormatIds.length) {
      throw new BadRequestError('One or more theatre formats are invalid or inactive');
    }

    if (uniquePersonIds.length > 0 && persons.length !== uniquePersonIds.length) {
      throw new BadRequestError('One or more cast or crew persons are invalid');
    }
  }
}