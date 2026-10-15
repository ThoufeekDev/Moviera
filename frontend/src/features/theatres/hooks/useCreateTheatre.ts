import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTheatreApi, type CreateTheatrePayload, type CreateTheatreApiResponse } from '../api/createTheatre.api';
import { theatreKeys } from '../keys';

export const useCreateTheatre = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTheatreApiResponse, Error, CreateTheatrePayload>({
    mutationFn: (payload: CreateTheatrePayload) => createTheatreApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: theatreKeys.all });
    },
  });
};
