import { describe, it, expect, vi } from 'vitest';
import { UpdateMovieUseCase } from './UpdateMovieUseCase';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import { MovieReferenceValidator } from '../services/MovieReferenceValidator';
import { MovieSlugService } from '../services/MovieSlugService';
import { MovieImageService } from '../services/MovieImageService';
import { Movie } from '../../domain/entities/Movie';
import { Genre } from '../../domain/entities/Genre';
import { Certification } from '../../domain/enums/Certification';

describe('UpdateMovieUseCase', () => {
  const existingMovie = new Movie(
    'movie-1',
    'Avatar',
    'avatar-2025',
    'Description',
    160,
    new Date('2025-12-15T00:00:00Z'),
    [],
    new Genre('g-1', 'Sci-Fi', 'sci-fi', true, new Date(), new Date()),
    [],
    Certification.UA,
    [],
    null,
    null,
    null,
    true,
    [],
    [],
  );

  it('should regenerate slug when release date year changes even if title stays identical', async () => {
    const mockRepo: IMovieRepository = {
      create: vi.fn(),
      findById: vi.fn().mockResolvedValue(existingMovie),
      existsBySlug: vi.fn().mockResolvedValue(false),
      updateMovie: vi.fn().mockResolvedValue(undefined),
    };

    const mockRefValidator = {
      validateForUpdate: vi.fn().mockResolvedValue(undefined),
    } as unknown as MovieReferenceValidator;

    const mockSlugService = {
      generateUniqueSlug: vi.fn().mockResolvedValue('avatar-2026'),
    } as unknown as MovieSlugService;

    const mockImageService = {
      uploadImages: vi.fn().mockResolvedValue({ poster: null, backdrop: null }),
      applyImageUpdates: vi.fn(),
      rollbackUploads: vi.fn(),
      cleanupOldImages: vi.fn(),
    } as unknown as MovieImageService;

    const useCase = new UpdateMovieUseCase(
      mockRepo,
      mockRefValidator,
      mockSlugService,
      mockImageService,
    );

    // Same title, but release year changed from 2025 to 2026
    await useCase.execute({
      id: 'movie-1',
      data: {
        releaseDate: new Date('2026-06-01T00:00:00Z'),
      },
    });

    expect(mockSlugService.generateUniqueSlug).toHaveBeenCalledWith(
      'Avatar',
      new Date('2026-06-01T00:00:00Z'),
      'movie-1',
    );
    expect(mockRepo.updateMovie).toHaveBeenCalledWith(
      'movie-1',
      expect.objectContaining({
        slug: 'avatar-2026',
      }),
    );
  });
});
