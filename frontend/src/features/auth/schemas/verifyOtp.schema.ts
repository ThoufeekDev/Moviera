import { z } from 'zod';

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
