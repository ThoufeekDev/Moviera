import { z } from 'zod';
import { SeatType } from '../../domain/enums/SeatType';

export const updateSeatPropertiesSchema = z.object({
  seats: z
    .array(
      z
        .object({
          seatId: z.string().trim().min(1, 'Seat ID is required'),
          type: z.enum(SeatType).optional(),
          isActive: z.boolean().optional(),
        })
        .refine((data) => data.type !== undefined || data.isActive !== undefined, {
          message: 'At least one property (type or isActive) must be provided',
        }),
    )
    .min(1, 'At least one seat is required')
    .max(1000, 'Cannot update more than 1000 seats at once')
    .superRefine((seats, ctx) => {
      const seatIds = seats.map((seat) => seat.seatId);

      if (new Set(seatIds).size !== seatIds.length) {
        ctx.addIssue({
          code: 'custom',
          message: 'Duplicate seat IDs are not allowed',
        });
      }
    }),
});

export type UpdateSeatPropertiesInput = z.infer<typeof updateSeatPropertiesSchema>;

