import { z } from 'zod';
import { SeatType } from '../../../theatre';
import { MIN_SHOW_SEAT_PRICE_PAISE } from '../../domain/constants/ShowPricingConstants';

export const seatPriceAdjustmentsSchema = z
  .object({
    [SeatType.REGULAR]: z.number().int('Price adjustment must be an integer in paise').optional(),
    [SeatType.PREMIUM]: z.number().int('Price adjustment must be an integer in paise').optional(),
    [SeatType.RECLINER]: z.number().int('Price adjustment must be an integer in paise').optional(),
    [SeatType.SOFA]: z.number().int('Price adjustment must be an integer in paise').optional(),
    [SeatType.WHEELCHAIR]: z
      .number()
      .int('Price adjustment must be an integer in paise')
      .optional(),
  })
  .strict();

export const createShowSchema = z
  .object({
    movieId: z.string().trim().min(1, 'Movie ID is required'),
    screenId: z.string().trim().min(1, 'Screen ID is required'),
    cinemaFormatId: z.string().trim().min(1, 'Cinema format ID is required'),
    startTime: z.coerce.date({
      message: 'Valid show start time is required',
    }),
    endTime: z.coerce
      .date({
        message: 'Valid show end time is required',
      })
      .optional(),
    basePrice: z
      .number()
      .int('Base price must be an integer in paise')
      .min(MIN_SHOW_SEAT_PRICE_PAISE, 'Base price must be at least 100 paise (₹1)'),
    priceAdjustments: seatPriceAdjustmentsSchema.optional().default({}),
  })
  .superRefine((data, ctx) => {
    if (data.endTime && data.endTime.getTime() <= data.startTime.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Show end time must be after start time',
      });
    }

    if (data.priceAdjustments) {
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

export type CreateShowInput = z.infer<typeof createShowSchema>;

