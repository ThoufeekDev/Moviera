import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFacilityStatus } from '../api/facilities.api';
import { theatreKeys } from '../keys';

export const useToggleFacilityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleFacilityStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...theatreKeys.all, 'facilities'],
      });
    },
  });
};
