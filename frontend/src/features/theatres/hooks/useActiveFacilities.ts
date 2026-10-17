import { useQuery } from '@tanstack/react-query';
import { getActiveFacilities } from '../api/facilities.api';
import { theatreKeys } from '../keys';

export const useActiveFacilities = () => {
  return useQuery({
    queryKey: theatreKeys.activeFacilities(),
    queryFn: ({ signal }) => getActiveFacilities(signal),
  });
};
