import { z } from 'zod';
import { ALLOWED_FACILITY_ICON_KEYS } from '../icons/facilityIcons';

export const facilityFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Facility name is required.')
    .min(2, 'Facility name must be between 2 and 60 characters.')
    .max(60, 'Facility name must be between 2 and 60 characters.'),
  description: z
    .string()
    .max(300, 'Description must not exceed 300 characters.')
    .optional(),
  iconKey: z
    .enum(ALLOWED_FACILITY_ICON_KEYS as unknown as [string, ...string[]])
    .nullable()
    .optional(),
});

export type FacilityFormData = z.infer<typeof facilityFormSchema>;

