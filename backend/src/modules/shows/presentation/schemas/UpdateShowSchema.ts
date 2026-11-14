import { z } from 'zod';
import { MIN_SHOW_SEAT_PRICE_PAISE } from '../../domain/constants/ShowPricingConstants';
import { seatPriceAdjustmentsSchema } from './CreateShowSchema';

export const updateShowSchema = z
  .object({
    movieId: z.string().trim().min(1, 'Movie ID cannot be empty').optional(),
    cinemaFormatId: z.string().trim().min(1, 'Cinema format ID cannot be empty').optional(),
    startTime: z.coerce
      .date({
        message: 'Valid show start time is required',
      })
      .optional(),
    endTime: z.coerce
      .date({
        message: 'Valid show end time is required',
      })
      .optional(),
    basePrice: z
      .number()
      .int('Base price must be an integer in paise')
      .min(MIN_SHOW_SEAT_PRICE_PAISE, 'Base price must be at least 100 paise (₹1)')
      .optional(),
    priceAdjustments: seatPriceAdjustmentsSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const hasAtLeastOneField =
      data.movieId !== undefined ||
      data.cinemaFormatId !== undefined ||
      data.startTime !== undefined ||
      data.endTime !== undefined ||
      data.basePrice !== undefined ||
      data.priceAdjustments !== undefined;

    if (!hasAtLeastOneField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided to update the show',
      });
    }

    if (
      data.startTime &&
      data.endTime &&
      data.endTime.getTime() <= data.startTime.getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Show end time must be after start time',
      });
    }

    if (data.basePrice !== undefined && data.priceAdjustments) {
      for (const [seatType, adjustment] of Object.entries(data.priceAdjustments)) {
        if (
          adjustment !== undefined &&
          data.basePrice + adjustment < MIN_SHOW_SEAT_PRICE_PAISE
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['priceAdjustments', seatType],
            message: `Final price for ${seatType} seats must be at least 100 paise (₹1)`,
          });
        }
      }
    }
  });

export type UpdateShowInput = z.infer<typeof updateShowSchema>;

