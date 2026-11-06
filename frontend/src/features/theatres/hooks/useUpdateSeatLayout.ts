import { useMutation } from '@tanstack/react-query';
import { updateSeatLayout } from '../api/seats.api';
import type { UpdateSeatLayoutPayload } from '../types/seat.types';

export const useUpdateSeatLayout = (screenId: string) => {
  return useMutation({
    mutationFn: (payload: UpdateSeatLayoutPayload) => updateSeatLayout(screenId, payload),
  });
};

