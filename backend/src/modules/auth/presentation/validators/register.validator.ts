import { z } from 'zod';
import { Role } from '../../../../shared/enums/Role';

export const registerSchema = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    role: z.enum(Role),
    turnstileToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });
