import { theatreKeys } from '@/features/theatres';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShow, publishShow } from '../api/shows.api';
import { showKeys } from '../keys';
import type { CreateShowPayload, ShowResult } from '../types/show.types';

export interface CreateShowMutationInput {
  payload: CreateShowPayload;
  publishImmediately?: boolean;
}

export const useCreateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      publishImmediately = false,
    }: CreateShowMutationInput): Promise<ShowResult> => {
      const created = await createShow(payload);
      if (publishImmediately) {
        return publishShow(created.id);
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: showKeys.all });
      queryClient.invalidateQueries({ queryKey: theatreKeys.all });
    },
  });
};

