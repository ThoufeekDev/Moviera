import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getScreens } from '../api/screens.api';
import type { GetScreensParams } from '../types/screen.types';
import { theatreKeys } from '../keys';

export const useScreens = (theatreId: string, params: GetScreensParams = {}) =>
  useQuery({
    queryKey: theatreKeys.screens(theatreId, params),
    queryFn: ({ signal }) => getScreens(theatreId, params, signal),
    placeholderData: keepPreviousData,
    enabled: Boolean(theatreId),
  });
