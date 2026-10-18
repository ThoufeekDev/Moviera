import { describe, it, expect } from 'vitest';
import { createMovieSchema } from '../schemas/CreateMovieSchema';
import { updateMovieSchema } from '../schemas/UpdateMovieSchema';
import { listMoviesForAdminSchema } from '../schemas/ListMoviesForAdminSchema';
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
      theatreFormatIds: ['format-1'],
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
      theatreFormatIds: ['format-1'],
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
      theatreFormatIds: ['format-1'],
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

  // C1: duration must be a positive integer in create and update (.int())
  it('should require duration to be a positive integer in create and update schemas', () => {
    const validBase = {
      title: 'Inception',
      releaseDate: '2026-07-16',
      languages: ['lang-1'],
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      theatreFormatIds: ['format-1'],
      certification: Certification.UA,
      cast: [],
      crew: [],
    };

    const createFloatResult = createMovieSchema.safeParse({
      ...validBase,
      duration: 148.5,
    });
    expect(createFloatResult.success).toBe(false);

    const createNegativeResult = createMovieSchema.safeParse({
      ...validBase,
      duration: -10,
    });
    expect(createNegativeResult.success).toBe(false);

    const updateFloatResult = updateMovieSchema.safeParse({
      duration: 120.4,
    });
    expect(updateFloatResult.success).toBe(false);

    const updateNegativeResult = updateMovieSchema.safeParse({
      duration: -5,
    });
    expect(updateNegativeResult.success).toBe(false);

    const updateValidResult = updateMovieSchema.safeParse({
      duration: 120,
    });
    expect(updateValidResult.success).toBe(true);
  });

  // C2: In update schema, genreIds, languageIds, or theatreFormatIds need at least 1 item when provided
  it('should require at least 1 item when genreIds, languageIds or theatreFormatIds are provided in update schema', () => {
    const genreResult = updateMovieSchema.safeParse({ genreIds: [] });
    expect(genreResult.success).toBe(false);
    if (!genreResult.success) {
      const messages = genreResult.error.issues.map((i) => i.message);
      expect(messages).toContain('At least one genre is required');
    }

    const langResult = updateMovieSchema.safeParse({ languageIds: [] });
    expect(langResult.success).toBe(false);
    if (!langResult.success) {
      const messages = langResult.error.issues.map((i) => i.message);
      expect(messages).toContain('At least one language is required');
    }

    const formatResult = updateMovieSchema.safeParse({ theatreFormatIds: [] });
    expect(formatResult.success).toBe(false);
    if (!formatResult.success) {
      const messages = formatResult.error.issues.map((i) => i.message);
      expect(messages).toContain('At least one theatre format is required');
    }
  });

  // C3: Reject duplicate crew entries (same personId and job, trimmed and case-insensitive) in create and update
  it('should reject duplicate crew entries (same person and job, trimmed and case-insensitive) in create and update', () => {
    const createResult = createMovieSchema.safeParse({
      title: 'Inception',
      duration: 148,
      releaseDate: '2026-07-16',
      languages: ['lang-1'],
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      theatreFormatIds: ['format-1'],
      certification: Certification.UA,
      cast: [],
      crew: [
        { personId: 'person-1', job: ' Director ' },
        { personId: 'person-1', job: 'director' },
      ],
    });
    expect(createResult.success).toBe(false);
    if (!createResult.success) {
      const messages = createResult.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Duplicate crew entries (same person and job) are not allowed',
      );
    }

    const updateResult = updateMovieSchema.safeParse({
      crew: [
        { personId: 'person-1', job: ' Producer ' },
        { personId: 'person-1', job: 'producer' },
      ],
    });
    expect(updateResult.success).toBe(false);
    if (!updateResult.success) {
      const messages = updateResult.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Duplicate crew entries (same person and job) are not allowed',
      );
    }
  });

  // C4: languages -> languageIds alias does not mutate incoming object
  it('should alias languages to languageIds without mutating the incoming object', () => {
    const createInput: Record<string, unknown> = {
      title: 'Inception',
      duration: 148,
      releaseDate: '2026-07-16',
      languages: ['lang-1'],
      primaryGenreId: 'genre-1',
      genreIds: ['genre-1'],
      theatreFormatIds: ['format-1'],
      certification: Certification.UA,
      cast: [],
      crew: [],
    };

    const createResult = createMovieSchema.safeParse(createInput);
    expect(createResult.success).toBe(true);
    expect(createInput).not.toHaveProperty('languageIds');

    const updateInput: Record<string, unknown> = {
      languages: ['lang-1'],
    };

    const updateResult = updateMovieSchema.safeParse(updateInput);
    expect(updateResult.success).toBe(true);
    expect(updateInput).not.toHaveProperty('languageIds');
  });

  // C5: Update schema isActive accepts real boolean or 'true'/'false' strings
  it('should accept boolean and string "true"/"false" for isActive in update schema', () => {
    const trueBoolResult = updateMovieSchema.safeParse({ isActive: true });
    expect(trueBoolResult.success).toBe(true);
    if (trueBoolResult.success) {
      expect(trueBoolResult.data.isActive).toBe(true);
    }

    const falseBoolResult = updateMovieSchema.safeParse({ isActive: false });
    expect(falseBoolResult.success).toBe(true);
    if (falseBoolResult.success) {
      expect(falseBoolResult.data.isActive).toBe(false);
    }

    const trueStringResult = updateMovieSchema.safeParse({ isActive: 'true' });
    expect(trueStringResult.success).toBe(true);
    if (trueStringResult.success) {
      expect(trueStringResult.data.isActive).toBe(true);
    }

    const falseStringResult = updateMovieSchema.safeParse({ isActive: 'false' });
    expect(falseStringResult.success).toBe(true);
    if (falseStringResult.success) {
      expect(falseStringResult.data.isActive).toBe(false);
    }

    const invalidResult = updateMovieSchema.safeParse({ isActive: 'invalid' });
    expect(invalidResult.success).toBe(false);
  });

  // C6: ListMoviesForAdminSchema search max 100
  it('should validate search length with max 100 characters in ListMoviesForAdminSchema', () => {
    const validResult = listMoviesForAdminSchema.safeParse({
      search: 'a'.repeat(100),
    });
    expect(validResult.success).toBe(true);

    const invalidResult = listMoviesForAdminSchema.safeParse({
      search: 'a'.repeat(101),
    });
    expect(invalidResult.success).toBe(false);
  });
});
