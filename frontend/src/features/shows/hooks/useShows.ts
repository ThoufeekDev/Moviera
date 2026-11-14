import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getShows } from '../api/shows.api';
import { showKeys } from '../keys';
import type { GetShowsParams } from '../types/show.types';

export const useShows = (params: GetShowsParams = {}, enabled = true) =>
  useQuery({
    queryKey: showKeys.list(params),
    queryFn: ({ signal }) => getShows(params, signal),
    placeholderData: keepPreviousData,
    enabled,
  });

