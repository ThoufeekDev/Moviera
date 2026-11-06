import { z } from 'zod';

export const theatreAdminAssignSchema = z
  .object({
    theatreId: z.string().trim().min(1, 'Please select a target theatre multiplex.'),
    role: z.enum(['PRIMARY_MANAGER', 'OPERATIONS_SUPERVISOR', 'BOX_OFFICE_LEAD'] as const, {
      message: 'Please select a valid operational role',
    }),
    mode: z.enum(['EMAIL', 'EXISTING']),
    userId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'EMAIL') {
      const trimmedName = data.name?.trim() || '';
      if (!trimmedName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Full name is required.',
          path: ['name'],
        });
      } else if (trimmedName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Full name must be at least 2 characters.',
          path: ['name'],
        });
      }

      const trimmedEmail = data.email?.trim() || '';
      if (!trimmedEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email address is required.',
          path: ['email'],
        });
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter a valid email address (e.g. manager@theatre.com).',
            path: ['email'],
          });
        }
      }

      const trimmedPhone = data.phone?.trim() || '';
      if (trimmedPhone && trimmedPhone.length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Contact phone must be at least 7 digits.',
          path: ['phone'],
        });
      }
    } else {
      if (!data.userId || !data.userId.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select an eligible administrator user.',
          path: ['userId'],
        });
      }
    }
  });

export type TheatreAdminAssignFormData = z.infer<typeof theatreAdminAssignSchema>;

