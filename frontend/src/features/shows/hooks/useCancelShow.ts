import { theatreKeys } from '@/features/theatres';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelShow } from '../api/shows.api';
import { showKeys } from '../keys';

export const useCancelShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (showId: string) => cancelShow(showId),
    onSuccess: (_data, showId) => {
      queryClient.invalidateQueries({ queryKey: showKeys.lists() });
      queryClient.invalidateQueries({ queryKey: showKeys.detail(showId) });
      queryClient.invalidateQueries({ queryKey: theatreKeys.all });
    },
  });
};

