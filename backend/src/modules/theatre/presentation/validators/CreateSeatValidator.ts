import { z } from 'zod';
import { SeatType } from '../../domain/enums/SeatType';
export const createSeatSchema = z.object({
  screenId: z.string().trim().min(1, 'Screen ID is required'),

  rowLabel: z
    .string()
    .trim()
    .min(1, 'Row label is required')
    .max(10, 'Row label must not exceed 10 characters'),

  seatNumber: z
    .number()
    .int('Seat number must be an integer')
    .positive('Seat number must be greater than 0'),

  x: z.number(),

  y: z.number(),

  rotation: z.number().optional(),

  type: z.enum(SeatType),
});