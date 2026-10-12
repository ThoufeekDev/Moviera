import { z } from 'zod';

export const getTheatreOverviewParamSchema = z.object({
  theatreId: z.string().trim().min(1, 'Theatre ID is required'),
});

export const createSeatParamSchema = z.object({
  screenId: z.string().trim().min(1, 'Screen ID is required'),
});

export type GetTheatreOverviewParamInput = z.infer<typeof getTheatreOverviewParamSchema>;
export type CreateSeatParamInput = z.infer<typeof createSeatParamSchema>;
