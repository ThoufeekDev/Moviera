import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editFacility, type EditFacilityPayload } from '../api/facilities.api';
import { theatreKeys } from '../keys';

export const useEditFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditFacilityPayload }) =>
      editFacility(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...theatreKeys.all, 'facilities'],
      });
    },
  });
};
