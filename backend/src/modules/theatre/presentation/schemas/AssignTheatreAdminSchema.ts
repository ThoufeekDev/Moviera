import { z } from 'zod';

export const assignTheatreAdminSchema = z
  .object({
    theatreId: z.string().trim().min(1, 'Please select a target cinema multiplex'),
    role: z
      .enum(['PRIMARY_MANAGER', 'OPERATIONS_SUPERVISOR', 'BOX_OFFICE_LEAD'], {
        message: 'Please select a valid operational role',
      })
      .optional(),
    userId: z.string().trim().optional().or(z.literal('')),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address (e.g. manager@cinema.com)')
      .optional()
      .or(z.literal('')),
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .trim()
      .min(7, 'Contact phone must be at least 7 digits')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => Boolean((data.userId && data.userId.length > 0) || (data.email && data.email.length > 0)),
    {
      message: 'Please enter an email address or select an existing administrator',
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


