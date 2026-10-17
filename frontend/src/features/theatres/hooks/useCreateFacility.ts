import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFacility, type CreateFacilityPayload } from '../api/facilities.api';
import { theatreKeys } from '../keys';

export const useCreateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFacilityPayload) => createFacility(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...theatreKeys.all, 'facilities'],
      });
    },
  });
};
