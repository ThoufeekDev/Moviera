import { useQuery } from '@tanstack/react-query';
import { getTheatreFormats, type TheatreFormat } from '../api/getTheatreFormats.api';

export const useTheatreFormats = () => {
  return useQuery<TheatreFormat[]>({
    queryKey: ['theatreFormats'],
    queryFn: getTheatreFormats,
    staleTime: 1000 * 60 * 30,
  });
};