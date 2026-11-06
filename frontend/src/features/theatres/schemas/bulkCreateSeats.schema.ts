import { z } from 'zod';
import { SEAT_TYPES } from '../types/seat.types';

export const bulkCreateSeatsRowSchema = z.object({
  rowLabel: z
    .string()
    .trim()
    .min(1, 'Row label is required')
    .max(10, 'Row label must not exceed 10 characters'),
  seatCount: z
    .number({ message: 'Seat count must be an integer' })
    .int('Seat count must be an integer')
    .min(1, 'Seat count must be between 1 and 50')
    .max(50, 'Seat count must be between 1 and 50'),
  type: z.enum(SEAT_TYPES, {
    message: 'Please select a valid seat type',
  }),
  rotation: z.number().min(-360).max(360).optional(),
});

export const bulkCreateSeatsSchema = z
  .object({
    rows: z
      .array(bulkCreateSeatsRowSchema)
      .min(1, 'At least one row is required'),
  })
  .superRefine((data, ctx) => {
    const rowLabels = data.rows.map((r) => r.rowLabel.trim().toUpperCase());

    const seen = new Set<string>();
    for (let i = 0; i < rowLabels.length; i++) {
      const label = rowLabels[i];
      if (seen.has(label)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate row labels are not allowed',
          path: ['rows', i, 'rowLabel'],
        });
      }
      seen.add(label);
    }

    const totalSeats = data.rows.reduce(
      (sum, r) => sum + (Number(r.seatCount) || 0),
      0,
    );
    if (totalSeats > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A screen cannot have more than 1000 seats',
        path: ['rows'],
      });
    }
  });

export type BulkCreateSeatsInput = z.infer<typeof bulkCreateSeatsSchema>;
export type BulkCreateSeatsRowInput = z.infer<typeof bulkCreateSeatsRowSchema>;
