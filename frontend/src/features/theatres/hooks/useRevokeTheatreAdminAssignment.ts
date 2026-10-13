import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeTheatreAdminAssignmentApi } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export const useRevokeTheatreAdminAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: string) =>
      revokeTheatreAdminAssignmentApi(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: theatreKeys.all });
    },
  });
};
