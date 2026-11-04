import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createScreen } from '../api/screens.api';
import type { CreateScreenPayload } from '../types/screen.types';
import { theatreKeys } from '../keys';

export const useCreateScreen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateScreenPayload) => createScreen(payload),
    onSuccess: (_screen, payload) => {
      queryClient.invalidateQueries({
        queryKey: [...theatreKeys.all, 'screens', payload.theatreId],
      });
      // The overview holds the screen count shown on the tabs.
      queryClient.invalidateQueries({ queryKey: theatreKeys.overview(payload.theatreId) });
    },
  });
};
