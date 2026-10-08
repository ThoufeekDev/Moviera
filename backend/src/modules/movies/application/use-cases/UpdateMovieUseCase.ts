import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';

import { UpdateMovieData } from '../../domain/types/UpdateMovieData';

import { UpdateMovieRequest } from '../dtos/UpdateMovieRequest';
import { MovieReferenceValidator } from '../services/MovieReferenceValidator';
import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { MovieSlugService } from '../services/MovieSlugService';
import { MovieImageService } from '../services/MovieImageService';
export class UpdateMovieUseCase implements IUseCase<UpdateMovieRequest, void> {
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly movieReferenceValidator: MovieReferenceValidator,
    private readonly movieSlugService: MovieSlugService,
    private readonly movieImageService: MovieImageService,
  
  ) {}

  async execute(request: UpdateMovieRequest): Promise<void> {
    const { id, data: movie } = request;

    const { posterFile, backdropFile, ...movieData } = movie;

    const existingMovie = await this.movieRepository.findById(id);

    if (!existingMovie) {
      throw new NotFoundError('Movie not found');
    }

    await this.movieReferenceValidator.validateForUpdate(movie, existingMovie);

    const updateData: UpdateMovieData = {
      ...movieData,
    };

    if (movie.title && movie.title !== existingMovie.title) {
      updateData.slug = await this.movieSlugService.generateUniqueSlug(
        movie.title,
        movie.releaseDate??existingMovie.releaseDate,
        existingMovie.id,
      );
    }

    const images = await this.movieImageService.uploadImages(movie);

    this.movieImageService.applyImageUpdates(updateData, images);

    try {
      await this.movieRepository.updateMovie(id, updateData);
    
    } catch (error) {
      await this.movieImageService.rollbackUploads(images);
      throw error;
    }

      await this.movieImageService.cleanupOldImages(existingMovie,images)
  }
}
