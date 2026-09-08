import { describe, it, expect, vi } from 'vitest';

import { UpdateMovieUseCase } from './UpdateMovieUseCase';
import { IMovieRepository } from '../../domain/repository/IMovieRepository';
import { Movie } from '../../domain/entities/Movie';

describe('UpdateMovieUseCase', () => {
  it('should update a movie', async () => {
   const existingMovie = new Movie(
      'Interstellar',
      'interstellar',
      'A space movie',
      169,
      new Date('2014-11-07'),
      'English',
      'Sci-Fi',
      'U/A',
      null,
      null,
      null,
      true,
    );

    const movieRepository: IMovieRepository = {
      create: vi.fn(),
      findById: vi.fn().mockResolvedValue(existingMovie),
      findBySlug: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      updatMovie: vi.fn().mockResolvedValue(existingMovie),
    };

    const updateMovieUseCase = new UpdateMovieUseCase(movieRepository);

    const result = await updateMovieUseCase.execute('movie-123', {
      title: 'Interstellar',
    });

    expect(movieRepository.findById).toHaveBeenCalledWith('movie-123');

    expect(movieRepository.updatMovie).toHaveBeenCalled();
    
    expect(result).toEqual(existingMovie);
  });
});
