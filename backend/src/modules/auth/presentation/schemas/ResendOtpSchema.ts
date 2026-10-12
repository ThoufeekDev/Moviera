import { z } from 'zod';

export const resendOtpSchema = z.object({
  email: z.email(),
});

export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
