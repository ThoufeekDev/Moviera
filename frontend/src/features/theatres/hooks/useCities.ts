import { useQuery } from '@tanstack/react-query';
import { getCities, type CityOption } from '../api/getCities.api';
import { theatreKeys } from '../keys';

const ONE_HOUR = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;

export const useCities = () => {
  return useQuery<CityOption[]>({
    queryKey: theatreKeys.cities(),
    queryFn: ({ signal }) => getCities(signal),
    staleTime: ONE_HOUR,
    gcTime: TWENTY_FOUR_HOURS,
  });
};
