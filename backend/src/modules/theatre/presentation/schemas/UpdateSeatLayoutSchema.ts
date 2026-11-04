
import { z } from 'zod';

export const updateSeatLayoutSchema = z.object({
  seats: z
    .array(
      z.object({
        seatId: z.string().trim().min(1, 'Seat ID is required'),
        x: z.number().min(0).max(1, 'X must be between 0 and 1'),
        y: z.number().min(0).max(1, 'Y must be between 0 and 1'),
        rotation: z.number().min(-360).max(360),
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

export type UpdateSeatLayoutInput = z.infer<typeof updateSeatLayoutSchema>;
