import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTheatreAdminAssignmentApi, type AdminRole } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export interface UpdateTheatreAdminAssignmentParams {
  assignmentId: string;
  data: {
    isActive?: boolean;
    role?: AdminRole;
  };
}

export const useUpdateTheatreAdminAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, data }: UpdateTheatreAdminAssignmentParams) =>
      updateTheatreAdminAssignmentApi(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: theatreKeys.all });
    },
  });
};
