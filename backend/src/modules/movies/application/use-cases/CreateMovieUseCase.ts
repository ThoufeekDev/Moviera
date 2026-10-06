import { ConflictError } from '../../../../shared/exceptions/ConflictError';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import { CreateMovieDTO } from '../dtos/CreateMovieDTO';
import { CreateMovieData } from '../../domain/types/CreateMovieData';
import { IGenreRepository } from '../../domain/repositories/IGenreRepository';
import { ICinemaFormatRepository } from '../../domain/repositories/ICinemaFormatRepository';
import { ILanguageRepository } from '../../domain/repositories/ILanguageRepository';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IStorageService } from '../../../../shared/domain/services/IStorageService';
import { generateSlug } from '../../../../shared/utils/generateSlug';
import { IUseCase } from '../interfaces/IUseCase';
import { MovieSlugService } from '../services/MovieSlugService';
import { MovieImageService } from '../services/MovieImageService';
import { MovieReferenceValidator } from '../services/MovieReferenceValidator';
export class CreateMovieUseCase implements IUseCase<CreateMovieDTO,void> {
  // I need a movie repository. Give me one.
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly movieReferenceValidator:MovieReferenceValidator,
    private readonly movieImageService: MovieImageService,
    private readonly movieSlugService: MovieSlugService,
  ) {}

  async execute(data: CreateMovieDTO): Promise<void> {
    

    await this.movieReferenceValidator.validateForCreate(data)
    const slug = await this.movieSlugService.generateUniqueSlug(data.title)
 
    const image = await this.movieImageService.uploadImages(data);


    const movieData: CreateMovieData = {
      title: data.title,
      slug,
      description: data.description ?? null,
      duration: data.duration,
      releaseDate: data.releaseDate,
      primaryGenreId: data.primaryGenreId,
      genreIds: data.genreIds,
      certification: data.certification,
      posterUrl: image.poster?.secureUrl ?? null,
      posterPublicId: image.poster?.publicId ?? null,
      backdropUrl: image.backdrop?.secureUrl ?? null,
      backdropPublicId: image.backdrop?.publicId ?? null,
      trailerUrl: data.trailerUrl ?? null,
      isActive: true,

      languageIds: data.languages,
      cinemaFormatIds: data.cinemaFormatIds,

      // cast & crew has array of object
      cast: data.cast,

      crew: data.crew,
    };

    try {
      await this.movieRepository.create(movieData);
    } catch (error) {
      await this.movieImageService.rollbackUploads(image)
      throw error
    }

   
  }
}
