import { z } from 'zod';

export const showIdParamSchema = z.object({
  showId: z.string().trim().min(1, 'Show ID is required'),
});

export const theatreShowsParamSchema = z.object({
  theatreId: z.string().trim().min(1, 'Theatre ID is required'),
});

export type ShowIdParamInput = z.infer<typeof showIdParamSchema>;
export type TheatreShowsParamInput = z.infer<typeof theatreShowsParamSchema>;

