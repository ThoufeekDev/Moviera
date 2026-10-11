import { describe, it, expect, vi } from 'vitest';
import { MovieSlugService } from './MovieSlugService';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository';

describe('MovieSlugService', () => {
  it('should use UTC year rather than local server year for slug generation', async () => {
    const mockRepo: IMovieRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      existsBySlug: vi.fn().mockResolvedValue(false),
      updateMovie: vi.fn(),
    };

    const slugService = new MovieSlugService(mockRepo);
    // Release date is 2026-12-31 23:59:00 UTC (in UTC+05:30 it would be 2027-01-01)
    const releaseDate = new Date('2026-12-31T23:59:00Z');

    const slug = await slugService.generateUniqueSlug('Interstellar Test', releaseDate);

    expect(slug).toBe('interstellar-test-2026');
    expect(mockRepo.existsBySlug).toHaveBeenCalledWith('interstellar-test-2026', undefined);
  });

  it('should increment suffix until existsBySlug returns false', async () => {
    const mockRepo: IMovieRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      existsBySlug: vi
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
      updateMovie: vi.fn(),
    };

    const slugService = new MovieSlugService(mockRepo);
    const releaseDate = new Date('2026-05-15T00:00:00Z');

    const slug = await slugService.generateUniqueSlug('Dune', releaseDate);

    expect(slug).toBe('dune-2026-3');
    expect(mockRepo.existsBySlug).toHaveBeenCalledTimes(3);
  });
});
