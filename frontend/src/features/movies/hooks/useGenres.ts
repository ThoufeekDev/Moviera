import { useQuery } from '@tanstack/react-query';
import { getGenres, type Genre } from '../api/getGenre.api';

export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: 1000 * 60 * 30,
  });
};
