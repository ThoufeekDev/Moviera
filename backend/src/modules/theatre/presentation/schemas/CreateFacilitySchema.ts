import { z } from 'zod';
import { ALLOWED_FACILITY_ICON_KEYS } from '../../domain/constants/FacilityIconKey';

export const createFacilitySchema = z.object({
  name: z
    .string({ message: 'Facility name is required.' })
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .refine((val) => val.length >= 2 && val.length <= 60, {
      message: 'Facility name must be between 2 and 60 characters.',
    }),
  description: z
    .string()
    .trim()
    .max(300, 'Description cannot exceed 300 characters.')
    .optional()
    .nullable(),
  iconKey: z
    .enum(ALLOWED_FACILITY_ICON_KEYS)
    .optional()
    .nullable(),
});

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
