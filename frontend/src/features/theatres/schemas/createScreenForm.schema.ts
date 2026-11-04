import { z } from 'zod';

export const SCREEN_NAME_MAX_LENGTH = 100;

// Mirrors the backend createScreenSchema. Client validation is UX only.
export const createScreenFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Screen name is required')
    .max(SCREEN_NAME_MAX_LENGTH, `Screen name must not exceed ${SCREEN_NAME_MAX_LENGTH} characters`)
    .refine((value) => /[a-z0-9]/i.test(value), 'Screen name must contain at least one letter or number'),
});

export type CreateScreenFormValues = z.infer<typeof createScreenFormSchema>;

export const defaultCreateScreenFormValues: CreateScreenFormValues = {
  name: '',
};
