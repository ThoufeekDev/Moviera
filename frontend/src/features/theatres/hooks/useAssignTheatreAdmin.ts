import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignTheatreAdminApi, type AdminRole } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export interface AssignTheatreAdminParams {
  theatreId: string;
  userId: string;
  role?: AdminRole;
}

export const useAssignTheatreAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignTheatreAdminParams) => assignTheatreAdminApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: theatreKeys.all });
    },
  });
};
