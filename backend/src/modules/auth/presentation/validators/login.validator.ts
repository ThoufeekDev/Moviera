import { z } from 'zod';
import { Role } from '../../../../shared/enums/Role';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(Role),
});
