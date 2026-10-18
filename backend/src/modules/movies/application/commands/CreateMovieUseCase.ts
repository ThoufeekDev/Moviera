import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import { CreateMovieDTO } from '../dtos/CreateMovieDTO';
import { CreateMovieData } from '../../domain/types/CreateMovieData';
import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { MovieSlugService } from '../services/MovieSlugService';
import { MovieImageService } from '../services/MovieImageService';
import { MovieReferenceValidator } from '../services/MovieReferenceValidator';

export class CreateMovieUseCase
  implements IUseCase<CreateMovieDTO, void>
{
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly movieReferenceValidator: MovieReferenceValidator,
    private readonly movieImageService: MovieImageService,
    private readonly movieSlugService: MovieSlugService,
  ) {}

  async execute(data: CreateMovieDTO): Promise<void> {
    // 1. Validate movie references.
    await this.movieReferenceValidator.validateForCreate(data);

    // 2. Generate a unique slug.
    const slug = await this.movieSlugService.generateUniqueSlug(
      data.title,
      data.releaseDate,
    );

    // 3. Upload images.
    const images = await this.movieImageService.uploadImages(data);

    // 4. Prepare data for persistence.
    const movieData: CreateMovieData = {
      title: data.title,
      slug,
      description: data.description ?? null,
      duration: data.duration,
      releaseDate: data.releaseDate,
      primaryGenreId: data.primaryGenreId,
      genreIds: data.genreIds,
      certification: data.certification,

      posterUrl: images.poster?.secureUrl ?? null,
      posterPublicId: images.poster?.publicId ?? null,
      backdropUrl: images.backdrop?.secureUrl ?? null,
      backdropPublicId: images.backdrop?.publicId ?? null,

      trailerUrl: data.trailerUrl ?? null,
      isActive: true,

      languageIds: data.languageIds,
      theatreFormatIds: data.theatreFormatIds,

      cast: data.cast,
      crew: data.crew,
    };

    // 5. Persist the movie and its relationships.
    try {
      await this.movieRepository.create(movieData);
    } catch (error) {
      await this.movieImageService.rollbackUploads(images);
      throw error;
    }
  }
}
