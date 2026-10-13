import { z } from 'zod';

export const revokeTheatreAdminAssignmentParamSchema = z.object({
  assignmentId: z.string().trim().min(1, 'Assignment ID is required'),
});

export type RevokeTheatreAdminAssignmentParamInput = z.infer<
  typeof revokeTheatreAdminAssignmentParamSchema
>;
