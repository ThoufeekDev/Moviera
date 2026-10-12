import { describe, it, expect, vi } from 'vitest';
import { CreateMovieUseCase } from './CreateMovieUseCase';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import { MovieReferenceValidator } from '../services/MovieReferenceValidator';
import { MovieImageService } from '../services/MovieImageService';
import { MovieSlugService } from '../services/MovieSlugService';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { Certification } from '../../domain/enums/Certification';
import { CreateMovieDTO } from '../dtos/CreateMovieDTO';

describe('CreateMovieUseCase', () => {
  it('should rollback uploaded images and rethrow ConflictError when repository create throws ConflictError', async () => {
    const conflictError = new ConflictError('A movie with this slug already exists');

    const mockRepo: IMovieRepository = {
      create: vi.fn().mockRejectedValue(conflictError),
      findById: vi.fn(),
      existsBySlug: vi.fn(),
      updateMovie: vi.fn(),
    };

    const mockRefValidator = {
      validateForCreate: vi.fn().mockResolvedValue(undefined),
    } as unknown as MovieReferenceValidator;

    const mockSlugService = {
      generateUniqueSlug: vi.fn().mockResolvedValue('test-movie-2025'),
    } as unknown as MovieSlugService;

    const uploadedImages = {
      poster: { publicId: 'poster-1', secureUrl: 'https://example.com/poster.jpg' },
      backdrop: { publicId: 'backdrop-1', secureUrl: 'https://example.com/backdrop.jpg' },
    };

    const mockImageService = {
      uploadImages: vi.fn().mockResolvedValue(uploadedImages),
      rollbackUploads: vi.fn().mockResolvedValue(undefined),
    } as unknown as MovieImageService;

    const useCase = new CreateMovieUseCase(
      mockRepo,
      mockRefValidator,
      mockImageService,
      mockSlugService,
    );

    const movieInput: CreateMovieDTO = {
      title: 'Test Movie',
      description: 'Test description',
      duration: 120,
      releaseDate: new Date('2025-01-01'),
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      certification: Certification.UA,
      languageIds: ['lang-1'],
      cinemaFormatIds: ['format-1'],
      cast: [],
      crew: [],
    };

    await expect(useCase.execute(movieInput)).rejects.toThrow(conflictError);
    expect(mockImageService.rollbackUploads).toHaveBeenCalledWith(uploadedImages);
  });
});
