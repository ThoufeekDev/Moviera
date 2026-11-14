import { z } from 'zod';

export const slugParamSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, digits, and hyphens');

export const getTheatreOverviewParamSchema = z.object({
  theatreId: z.string().trim().min(1, 'Theatre ID is required'),
});

export const getTheatreBySlugParamSchema = z.object({
  citySlug: slugParamSchema,
  theatreSlug: slugParamSchema,
});

export const getScreenBySlugParamSchema = z.object({
  theatreId: z.string().trim().min(1, 'Theatre ID is required'),
  screenSlug: slugParamSchema,
});

export const createSeatParamSchema = z.object({
  screenId: z.string().trim().min(1, 'Screen ID is required'),
});

export const updateSeatParamSchema = z.object({
  seatId: z.string().trim().min(1, 'Seat ID is required'),
});

export type GetTheatreOverviewParamInput = z.infer<typeof getTheatreOverviewParamSchema>;
export type GetTheatreBySlugParamInput = z.infer<typeof getTheatreBySlugParamSchema>;
export type GetScreenBySlugParamInput = z.infer<typeof getScreenBySlugParamSchema>;
export type CreateSeatParamInput = z.infer<typeof createSeatParamSchema>;
