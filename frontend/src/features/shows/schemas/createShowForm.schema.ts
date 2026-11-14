import type { SeatType } from '@/features/theatres';
import { z } from 'zod';

export const ORDERED_SHOW_SEAT_CATEGORIES: readonly SeatType[] = [
  'REGULAR',
  'PREMIUM',
  'RECLINER',
  'SOFA',
  'WHEELCHAIR',
] as const;

export const DEFAULT_SEAT_ADJUSTMENTS_RUPEES: Record<SeatType, number> = {
  REGULAR: 0,
  PREMIUM: 50,
  RECLINER: 150,
  SOFA: 200,
  WHEELCHAIR: -20,
};

export const createShowFormSchema = z
  .object({
    theatreId: z.string().trim().min(1, 'Please select a theatre'),
    movieId: z.string().trim().min(1, 'Please select a movie'),
    screenId: z.string().trim().min(1, 'Please select a screen'),
    cinemaFormatId: z.string().trim().min(1, 'Please select a cinema format'),
    showDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid show date'),
    showTime: z
      .string()
      .trim()
      .regex(/^\d{2}:\d{2}$/, 'Please select a valid show time'),
    basePriceRupees: z.coerce
      .number({ message: 'Enter a valid base ticket price in ₹' })
      .min(1, 'Base ticket price must be at least ₹1'),
    priceAdjustmentsRupees: z.object({
      REGULAR: z.coerce.number({ message: 'Enter a valid adjustment' }),
      PREMIUM: z.coerce.number({ message: 'Enter a valid adjustment' }),
      RECLINER: z.coerce.number({ message: 'Enter a valid adjustment' }),
      SOFA: z.coerce.number({ message: 'Enter a valid adjustment' }),
      WHEELCHAIR: z.coerce.number({ message: 'Enter a valid adjustment' }),
    }),
  })
  .superRefine((data, ctx) => {
    for (const category of ORDERED_SHOW_SEAT_CATEGORIES) {
      const adjustment = data.priceAdjustmentsRupees[category] ?? 0;
      const finalPriceRupees = data.basePriceRupees + adjustment;
      if (finalPriceRupees < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['priceAdjustmentsRupees', category],
          message: `Final price for ${category.toLowerCase()} seats must be at least ₹1`,
        });
      }
    }
  });

export type CreateShowFormValues = z.infer<typeof createShowFormSchema>;

