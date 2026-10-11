import { describe, it, expect } from 'vitest';
import { createMovieSchema } from '../schemas/CreateMovieSchema';
import { updateMovieSchema } from '../schemas/UpdateMovieSchema';
import { Certification } from '../../domain/enums/Certification';

describe('Movie Schemas Validation', () => {
  it('should reject duplicate language IDs with clear error message', () => {
    const result = createMovieSchema.safeParse({
      title: 'Inception',
      duration: 148,
      releaseDate: '2026-07-16',
      languages: ['lang-1', 'lang-1'],
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      cinemaFormatIds: ['format-1'],
      certification: Certification.UA,
      cast: [],
      crew: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Duplicate language IDs are not allowed');
    }
  });

  it('should reject duplicate cast entries (same person and character)', () => {
    const result = createMovieSchema.safeParse({
      title: 'Inception',
      duration: 148,
      releaseDate: '2026-07-16',
      languages: ['lang-1'],
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      cinemaFormatIds: ['format-1'],
      certification: Certification.UA,
      cast: [
        { personId: 'person-1', character: 'Cobb' },
        { personId: 'person-1', character: 'Cobb' },
      ],
      crew: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Duplicate cast entries (same person and character) are not allowed',
      );
    }
  });

  it('should transform empty string trailerUrl to undefined in create and null in update', () => {
    const createResult = createMovieSchema.safeParse({
      title: 'Inception',
      duration: 148,
      releaseDate: '2026-07-16',
      languages: ['lang-1'],
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      cinemaFormatIds: ['format-1'],
      certification: Certification.UA,
      cast: [],
      crew: [],
      trailerUrl: '',
    });

    expect(createResult.success).toBe(true);
    if (createResult.success) {
      expect(createResult.data.trailerUrl).toBeUndefined();
    }

    const updateResult = updateMovieSchema.safeParse({
      trailerUrl: '',
      description: null,
    });

    expect(updateResult.success).toBe(true);
    if (updateResult.success) {
      expect(updateResult.data.trailerUrl).toBeNull();
      expect(updateResult.data.description).toBeNull();
    }
  });
});
