import { z } from 'zod';

export const toggleFacilityStatusParamSchema = z.object({
  facilityId: z.string({ message: 'Facility ID is required.' }).trim().min(1, 'Facility ID is required.'),
});

export const toggleFacilityStatusBodySchema = z.object({
  isActive: z.boolean({ message: 'isActive status is required.' }),
});

export type ToggleFacilityStatusParamInput = z.infer<typeof toggleFacilityStatusParamSchema>;
export type ToggleFacilityStatusBodyInput = z.infer<typeof toggleFacilityStatusBodySchema>;
