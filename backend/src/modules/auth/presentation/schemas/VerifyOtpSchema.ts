import { z } from 'zod';

export const verifyUserOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export type VerifyUserOtpInput = z.infer<typeof verifyUserOtpSchema>;
