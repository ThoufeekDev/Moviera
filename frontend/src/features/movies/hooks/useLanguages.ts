import { useQuery } from '@tanstack/react-query';
import { getLanguages, type Language } from '../api/getLanguages.api';

export const useLanguages = () => {
  return useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 30,
  });
};
