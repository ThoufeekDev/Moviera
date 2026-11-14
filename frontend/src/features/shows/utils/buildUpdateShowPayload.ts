import type { SeatType } from '@/features/theatres';
import {
  ORDERED_SHOW_SEAT_CATEGORIES,
  type CreateShowFormValues,
} from '../schemas/createShowForm.schema';
import type { UpdateShowPayload } from '../types/show.types';
import { rupeesToPaise } from './showPricing.utils';
import { combineDateAndTime } from './showScheduling.utils';

function isPricingChanged(
  values: CreateShowFormValues,
  initial: CreateShowFormValues,
): boolean {
  if (rupeesToPaise(values.basePriceRupees) !== rupeesToPaise(initial.basePriceRupees)) {
    return true;
  }
  return ORDERED_SHOW_SEAT_CATEGORIES.some(
    (category) =>
      rupeesToPaise(values.priceAdjustmentsRupees[category] ?? 0) !==
      rupeesToPaise(initial.priceAdjustmentsRupees[category] ?? 0),
  );
}

/**
 * Builds a PATCH /shows/:id payload containing only what changed and what the
 * backend allows. When the show already has bookings only the schedule can be
 * edited. Returns null when nothing changed.
 *
 * Pricing is always sent as a full set (base + every adjustment) because the
 * backend regenerates the seat inventory from it.
 */
export function buildUpdateShowPayload(
  values: CreateShowFormValues,
  initial: CreateShowFormValues,
  pricingLocked: boolean,
): UpdateShowPayload | null {
  const payload: UpdateShowPayload = {};

  const nextStart = combineDateAndTime(values.showDate, values.showTime);
  const initialStart = combineDateAndTime(initial.showDate, initial.showTime);
  if (!nextStart) {
    throw new Error('Invalid show date or time');
  }
  if (!initialStart || nextStart.getTime() !== initialStart.getTime()) {
    payload.startTime = nextStart.toISOString();
  }

  if (!pricingLocked) {
    if (values.movieId !== initial.movieId) payload.movieId = values.movieId;
    if (values.cinemaFormatId !== initial.cinemaFormatId) {
      payload.cinemaFormatId = values.cinemaFormatId;
    }

    if (isPricingChanged(values, initial)) {
      const priceAdjustments: Partial<Record<SeatType, number>> = {};
      for (const category of ORDERED_SHOW_SEAT_CATEGORIES) {
        priceAdjustments[category] = rupeesToPaise(
          values.priceAdjustmentsRupees[category] ?? 0,
        );
      }
      payload.basePrice = rupeesToPaise(values.basePriceRupees);
      payload.priceAdjustments = priceAdjustments;
    }
  }

  return Object.keys(payload).length > 0 ? payload : null;
}

