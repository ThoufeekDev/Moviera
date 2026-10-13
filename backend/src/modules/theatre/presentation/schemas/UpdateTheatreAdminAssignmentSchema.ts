import { z } from 'zod';

export const updateTheatreAdminAssignmentParamSchema = z.object({
  assignmentId: z.string().trim().min(1, 'Assignment ID is required'),
});

export const updateTheatreAdminAssignmentBodySchema = z
  .object({
    isActive: z.boolean().optional(),
    role: z.enum(['PRIMARY_MANAGER', 'OPERATIONS_SUPERVISOR', 'BOX_OFFICE_LEAD']).optional(),
  })
  .refine((data) => data.isActive !== undefined || data.role !== undefined, {
    message: 'Either isActive or role must be provided',
  });

export type UpdateTheatreAdminAssignmentParamInput = z.infer<
  typeof updateTheatreAdminAssignmentParamSchema
>;
export type UpdateTheatreAdminAssignmentBodyInput = z.infer<
  typeof updateTheatreAdminAssignmentBodySchema
>;
