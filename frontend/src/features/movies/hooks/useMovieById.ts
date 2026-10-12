import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '../api/getMovieById.api';
import { movieKeys } from '../keys';

export const useMovieById = (id?: string) => {
  return useQuery({
    queryKey: movieKeys.detail(id!),
    queryFn: () => getMovieById(id!),
    enabled: Boolean(id),
  });
};
