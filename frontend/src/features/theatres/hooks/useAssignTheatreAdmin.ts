import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignTheatreAdminApi, type AdminRole } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export interface AssignTheatreAdminParams {
  theatreId: string;
  role?: AdminRole;
  userId?: string;
  email?: string;
  name?: string;
  phone?: string;
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
