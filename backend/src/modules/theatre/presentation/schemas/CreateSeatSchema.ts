import { z } from 'zod';
import { SeatType } from '../../domain/enums/SeatType';

export const createSeatSchema = z.object({
  screenId: z.string().trim().min(1, 'Screen ID is required').optional(),

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




export const bulkCreateSeatsSchema = z.object({
  rows: z
    .array(
      z.object({
        rowLabel: z
          .string()
          .trim()
          .min(1, 'Row label is required')
          .max(10, 'Row label must not exceed 10 characters'),

        seatCount: z
          .number()
          .int('Seat count must be an integer')
          .min(1, 'Seat count must be at least 1')
          .max(50, 'A row cannot have more than 50 seats'),

        type: z.enum(SeatType),

        rotation: z.number().optional(),
      }),
    )
    .min(1, 'At least one row is required')
    .superRefine((rows, ctx) => {
      const rowLabels = rows.map((row) =>
        row.rowLabel.toUpperCase(),
      );

      if (new Set(rowLabels).size !== rowLabels.length) {
        ctx.addIssue({
          code: 'custom',
          message: 'Duplicate row labels are not allowed',
        });
      }

      const totalSeats = rows.reduce(
        (total, row) => total + row.seatCount,
        0,
      );

      if (totalSeats > 1000) {
        ctx.addIssue({
          code: 'custom',
          message: 'A screen cannot have more than 1000 seats',
        });
      }
    }),
});


export type CreateSeatInput = z.infer<typeof createSeatSchema>;
export type BulkCreateSeatsInput = z.infer<typeof bulkCreateSeatsSchema>;