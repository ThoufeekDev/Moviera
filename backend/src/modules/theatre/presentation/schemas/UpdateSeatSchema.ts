import { z } from 'zod';
import { SeatType } from '../../domain/enums/SeatType';

export const updateSeatSchema = z
  .object({
    type: z.enum(SeatType).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => data.type !== undefined || data.isActive !== undefined,
    {
      message: 'At least one field must be provided',
    },
);

export type UpdateSeatInput = z.infer<typeof updateSeatSchema>;