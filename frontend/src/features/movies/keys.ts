import type { GetMoviesParams } from './api/getMovies.api';

export const movieKeys = {
  all: ['movies'] as const,
  list: (p?: GetMoviesParams) => [...movieKeys.all, 'list', p] as const,
  detail: (id: string) => [...movieKeys.all, 'detail', id] as const,
};
