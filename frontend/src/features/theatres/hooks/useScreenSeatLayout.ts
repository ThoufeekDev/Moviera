import { useQuery } from '@tanstack/react-query';
import { getScreenSeatLayout } from '../api/seats.api';
import { theatreKeys } from '../keys';

export const useScreenSeatLayout = (screenId: string) =>
  useQuery({
    queryKey: theatreKeys.seatLayout(screenId),
    queryFn: ({ signal }) => getScreenSeatLayout(screenId, signal),
    enabled: Boolean(screenId),
  });

