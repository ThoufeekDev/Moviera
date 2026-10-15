import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllTheatres, type GetAllTheatresParams } from '../api/getAllTheatres.api';
import { theatreKeys } from '../keys';

export const useAllTheatres = (params: GetAllTheatresParams = {}) => {
  return useQuery({
    queryKey: theatreKeys.manageList(params),
    queryFn: ({ signal }) => getAllTheatres(params, signal),
    placeholderData: keepPreviousData,
  });
};
