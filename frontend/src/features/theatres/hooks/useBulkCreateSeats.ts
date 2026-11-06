import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkCreateSeats } from '../api/seats.api';
import type { BulkCreateSeatsPayload } from '../types/seat.types';
import { theatreKeys } from '../keys';

export const useBulkCreateSeats = (screenId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkCreateSeatsPayload) => bulkCreateSeats(screenId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...theatreKeys.all, 'screens'],
      });
    },
  });
};

