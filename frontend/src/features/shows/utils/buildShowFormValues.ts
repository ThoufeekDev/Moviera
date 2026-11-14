import {
  DEFAULT_SEAT_ADJUSTMENTS_RUPEES,
  ORDERED_SHOW_SEAT_CATEGORIES,
  type CreateShowFormValues,
} from '../schemas/createShowForm.schema';
import type { ShowDetail } from '../types/show.types';
import { paiseToRupees } from './showPricing.utils';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function buildShowFormValuesFromDetail(detail: ShowDetail): CreateShowFormValues {
  const start = new Date(detail.startTime);

  const adjustments = { ...DEFAULT_SEAT_ADJUSTMENTS_RUPEES };
  for (const category of ORDERED_SHOW_SEAT_CATEGORIES) {
    adjustments[category] = 0;
  }
  for (const tier of detail.pricing.tiers) {
    adjustments[tier.seatType] = paiseToRupees(tier.priceAdjustment);
  }

  return {
    theatreId: detail.theatre.id,
    movieId: detail.movie.id,
    screenId: detail.screen.id,
    cinemaFormatId: detail.cinemaFormat.id,
    showDate: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    showTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    basePriceRupees: paiseToRupees(detail.basePrice),
    priceAdjustmentsRupees: adjustments,
  };
}

/**
 * Show seats that are no longer AVAILABLE indicate booking activity. The backend
 * is the source of truth (it counts bookings), this only decides which controls
 * are read-only in the UI.
 */
export function hasBookingActivity(detail: ShowDetail): boolean {
  const { totalSeats, availableSeats, bookedSeats } = detail.seatInventorySummary;
  return bookedSeats > 0 || availableSeats < totalSeats;
}

