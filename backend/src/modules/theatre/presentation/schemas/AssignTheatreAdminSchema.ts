
import { z } from 'zod';

export const assignTheatreAdminSchema = z.object({
  userId: z.string().trim().min(1, 'User ID is required'),
  theatreId: z.string().trim().min(1, 'Theatre ID is required'),
});
