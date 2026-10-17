import { z } from 'zod';
import { ALLOWED_FACILITY_ICON_KEYS } from '../../domain/constants/FacilityIconKey';

export const editFacilityParamSchema = z.object({
  facilityId: z.string({ message: 'Facility ID is required.' }).trim().min(1, 'Facility ID is required.'),
});

export const editFacilityBodySchema = z.object({
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

export type EditFacilityParamInput = z.infer<typeof editFacilityParamSchema>;
export type EditFacilityBodyInput = z.infer<typeof editFacilityBodySchema>;
