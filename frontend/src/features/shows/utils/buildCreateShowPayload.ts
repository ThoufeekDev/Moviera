import type { SeatType } from '@/features/theatres';
import {
  ORDERED_SHOW_SEAT_CATEGORIES,
  type CreateShowFormValues,
} from '../schemas/createShowForm.schema';
import type { CreateShowPayload } from '../types/show.types';
import { rupeesToPaise } from './showPricing.utils';
import { combineDateAndTime } from './showScheduling.utils';

export function buildCreateShowPayload(
  values: CreateShowFormValues,
): CreateShowPayload {
  const startTimeDate = combineDateAndTime(values.showDate, values.showTime);
  if (!startTimeDate) {
    throw new Error('Invalid show date or time');
  }

  const priceAdjustments: Partial<Record<SeatType, number>> = {};
  for (const category of ORDERED_SHOW_SEAT_CATEGORIES) {
    const adjustmentRupees = values.priceAdjustmentsRupees[category] ?? 0;
    priceAdjustments[category] = rupeesToPaise(adjustmentRupees);
  }

  return {
    movieId: values.movieId.trim(),
    screenId: values.screenId.trim(),
    cinemaFormatId: values.cinemaFormatId.trim(),
    startTime: startTimeDate.toISOString(),
    basePrice: rupeesToPaise(values.basePriceRupees),
    priceAdjustments,
  };
}

