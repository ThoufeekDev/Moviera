import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMovies, type GetMoviesParams } from '../api/getMovies.api';
import { movieKeys } from '../keys';

export const useMovies = (params: GetMoviesParams = {}) => {
  return useQuery({
    queryKey: movieKeys.list(params),
    queryFn: () => getMovies(params),
    placeholderData: keepPreviousData,
  });
};