import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShow } from '../api/shows.api';
import { showKeys } from '../keys';
import type { UpdateShowPayload } from '../types/show.types';

export interface UpdateShowMutationInput {
  showId: string;
  payload: UpdateShowPayload;
}

export const useUpdateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ showId, payload }: UpdateShowMutationInput) =>
      updateShow(showId, payload),
    onSuccess: (_data, { showId }) => {
      queryClient.invalidateQueries({ queryKey: showKeys.lists() });
      queryClient.invalidateQueries({ queryKey: showKeys.detail(showId) });
    },
  });
};

