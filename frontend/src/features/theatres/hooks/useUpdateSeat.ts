import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSeat } from '../api/seats.api';
import type { UpdateSeatPayload } from '../types/seat.types';
import { theatreKeys } from '../keys';

export const useUpdateSeat = (screenId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seatId, payload }: { seatId: string; payload: UpdateSeatPayload }) =>
      updateSeat(seatId, payload),
    onSuccess: () => {
      if (screenId) {
        queryClient.invalidateQueries({
          queryKey: theatreKeys.seatLayout(screenId),
        });
      }
    },
  });
};

