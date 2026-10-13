import { useQuery } from '@tanstack/react-query';
import { getCinemaFormats, type CinemaFormat } from '../api/getCinemaFormats.api';

export const useCinemaFormats = () => {
  return useQuery<CinemaFormat[]>({
    queryKey: ['cinemaFormats'],
    queryFn: getCinemaFormats,
    staleTime: 1000 * 60 * 30,
  });
};