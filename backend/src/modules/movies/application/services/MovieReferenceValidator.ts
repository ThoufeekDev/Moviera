import { IGenreRepository } from '../../domain/repositories/IGenreRepository';
import { ILanguageRepository } from '../../domain/repositories/ILanguageRepository';
import { ICinemaFormatRepository } from '../../domain/repositories/ICinemaFormatRepository';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { UpdateMovieDTO } from '../dtos/UpdateMovieDTO';
import { Movie } from '../../domain/entities/Movie';
import { CreateMovieDTO } from '../dtos/CreateMovieDTO';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
export class MovieReferenceValidator {
  constructor(
    private readonly genreRepository: IGenreRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly cinemaFormatRepository: ICinemaFormatRepository,
    private readonly personRepository: IPersonRepository,
  ) {}

  async validateForUpdate(movie: UpdateMovieDTO, existingMovie: Movie): Promise<void> {
    // Validate genre changes

    if (movie.genreIds) {
      const genres = await this.genreRepository.findByIds(movie.genreIds);

      if (genres.length !== movie.genreIds.length) {
        throw new BadRequestError('One or more genres are invalid or inactive');
      }

      const primaryGenreId = movie.primaryGenreId ?? existingMovie.primaryGenre.id;

      if (!movie.genreIds.includes(primaryGenreId)) {
        throw new BadRequestError('Primary genre must be included in genreIds');
      }
    }

    if (movie.primaryGenreId && !movie.genreIds) {
      const currentGenreIds = existingMovie.genres.map((genre) => genre.id);

      if (!currentGenreIds.includes(movie.primaryGenreId)) {
        throw new BadRequestError('Primary genre must already belong to the movie genres');
      }
    }

    // Collect person IDs from cast and crew

    const personIds = [
      ...(movie.cast?.map((item) => item.personId) ?? []),
      ...(movie.crew?.map((item) => item.personId) ?? []),
    ];

    // Validate independent reference data in parallel

    const [languages, cinemaFormats, persons, primaryGenre] = await Promise.all([
      movie.languageIds
        ? this.languageRepository.findByIds(movie.languageIds)
        : Promise.resolve([]),

      movie.cinemaFormatIds
        ? this.cinemaFormatRepository.findByIds(movie.cinemaFormatIds)
        : Promise.resolve([]),

      personIds.length > 0 ? this.personRepository.findByIds(personIds) : Promise.resolve([]),

      movie.primaryGenreId && !movie.genreIds
        ? this.genreRepository.findById(movie.primaryGenreId)
        : Promise.resolve(null),
    ]);

    if (movie.primaryGenreId && !movie.genreIds && !primaryGenre) {
      throw new BadRequestError('Invalid or inactive genre');
    }

    if (movie.languageIds && languages.length !== movie.languageIds.length) {
      throw new BadRequestError('One or more languages are invalid');
    }

    if (movie.cinemaFormatIds && cinemaFormats.length !== movie.cinemaFormatIds.length) {
      throw new BadRequestError('One or more cinema formats are invalid or inactive');
    }

    if (personIds.length > 0 && persons.length !== new Set(personIds).size) {
      throw new BadRequestError('One or more cast or crew persons are invalid');
    }
  }

  async validateForCreate(movie: CreateMovieDTO): Promise<void> {
    const personIds = [
      ...movie.cast.map((item) => item.personId),
      ...movie.crew.map((item) => item.personId),
    ];

    const [genres, languages, cinemaFormats, persons] = await Promise.all([
      this.genreRepository.findByIds(movie.genreIds),
      this.languageRepository.findByIds(movie.languages),
      this.cinemaFormatRepository.findByIds(movie.cinemaFormatIds),
      personIds.length > 0 ? this.personRepository.findByIds(personIds) : Promise.resolve([]),
    ]);

    if (genres.length !== movie.genreIds.length) {
      throw new BadRequestError('One or more genres are invalid or inactive');
    }

    if (!movie.genreIds.includes(movie.primaryGenreId)) {
      throw new BadRequestError('Primary genre must be included in genreIds');
    }

    if (languages.length !== movie.languages.length) {
      throw new BadRequestError('One or more languages are invalid');
    }

    if (cinemaFormats.length !== movie.cinemaFormatIds.length) {
      throw new BadRequestError('One or more cinema formats are invalid or inactive');
    }

    if (personIds.length > 0 && persons.length !== new Set(personIds).size) {
      throw new BadRequestError('One or more cast or crew persons are invalid');
    }
  }
}
