import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getFacilities, type GetFacilitiesParams } from '../api/facilities.api';
import { theatreKeys } from '../keys';

export const useFacilities = (params: GetFacilitiesParams = {}) => {
  return useQuery({
    queryKey: theatreKeys.facilities(params),
    queryFn: ({ signal }) => getFacilities(params, signal),
    placeholderData: keepPreviousData,
  });
};
