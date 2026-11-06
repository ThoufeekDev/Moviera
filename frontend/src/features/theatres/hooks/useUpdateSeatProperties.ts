import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSeatProperties } from '../api/seats.api';
import type { UpdateSeatPropertiesPayload } from '../types/seat.types';
import { theatreKeys } from '../keys';

export const useUpdateSeatProperties = (screenId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSeatPropertiesPayload) => updateSeatProperties(screenId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: theatreKeys.seatLayout(screenId),
      });
    },
  });
};

