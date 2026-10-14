import { z } from 'zod';

export const assignTheatreAdminSchema = z
  .object({
    theatreId: z.string().trim().min(1, 'Target cinema is required'),
    role: z
      .enum(['PRIMARY_MANAGER', 'OPERATIONS_SUPERVISOR', 'BOX_OFFICE_LEAD'], {
        message: 'Please select a valid operational role',
      })
      .optional(),
    userId: z.string().trim().optional().or(z.literal('')),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal('')),
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .trim()
      .min(7, 'Phone number must be at least 7 digits')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => Boolean((data.userId && data.userId.length > 0) || (data.email && data.email.length > 0)),
    {
      message: 'Either an existing administrator or an email address must be provided',
      path: ['email'],
    },
  )
  .refine(
    (data) => !data.email || Boolean(data.name && data.name.trim().length >= 2),
    {
      message: 'Full name (at least 2 characters) is required when inviting by email',
      path: ['name'],
    },
  );

export type AssignTheatreAdminInput = z.infer<typeof assignTheatreAdminSchema>;


