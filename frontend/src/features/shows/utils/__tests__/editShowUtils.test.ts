import { describe, expect, it } from 'vitest';
import type { ShowDetail } from '../../types/show.types';
import { buildShowFormValuesFromDetail, hasBookingActivity } from '../buildShowFormValues';
import { buildUpdateShowPayload } from '../buildUpdateShowPayload';

const baseDetail: ShowDetail = {
  id: 'show-1',
  status: 'DRAFT',
  startTime: new Date(2026, 0, 28, 19, 30).toISOString(),
  endTime: new Date(2026, 0, 28, 22, 31).toISOString(),
  basePrice: 15000,
  movie: {
    id: 'm1',
    title: 'Movie',
    posterUrl: null,
    duration: 181,
    languages: ['English'],
    certification: 'UA',
    isActive: true,
  },
  screen: { id: 's1', name: 'Screen 1', totalSeats: 300, isActive: true },
  theatre: {
    id: 't1',
    name: 'Galaxy',
    cityName: 'Kochi',
    cleaningBufferMinutes: 15,
    isActive: true,
  },
  cinemaFormat: { id: 'f1', name: '2D', slug: '2d' },
  pricing: {
    basePrice: 15000,
    minPrice: 13000,
    maxPrice: 35000,
    tiers: [
      { seatType: 'REGULAR', priceAdjustment: 0, finalPrice: 15000, totalSeats: 100, availableSeats: 100, bookedSeats: 0 },
      { seatType: 'PREMIUM', priceAdjustment: 5000, finalPrice: 20000, totalSeats: 100, availableSeats: 100, bookedSeats: 0 },
      { seatType: 'WHEELCHAIR', priceAdjustment: -2000, finalPrice: 13000, totalSeats: 100, availableSeats: 100, bookedSeats: 0 },
    ],
  },
  seatInventorySummary: { totalSeats: 300, availableSeats: 300, bookedSeats: 0 },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('edit show utils', () => {
  it('maps a show detail to form values in rupees (missing tiers default to 0)', () => {
    const values = buildShowFormValuesFromDetail(baseDetail);

    expect(values.showDate).toBe('2026-01-28');
    expect(values.showTime).toBe('19:30');
    expect(values.basePriceRupees).toBe(150);
    expect(values.priceAdjustmentsRupees).toEqual({
      REGULAR: 0,
      PREMIUM: 50,
      RECLINER: 0,
      SOFA: 0,
      WHEELCHAIR: -20,
    });
  });

  it('detects booking activity from seat inventory', () => {
    expect(hasBookingActivity(baseDetail)).toBe(false);
    expect(
      hasBookingActivity({
        ...baseDetail,
        seatInventorySummary: { totalSeats: 300, availableSeats: 298, bookedSeats: 0 },
      }),
    ).toBe(true);
  });

  it('returns null when nothing changed', () => {
    const initial = buildShowFormValuesFromDetail(baseDetail);
    expect(buildUpdateShowPayload(initial, initial, false)).toBeNull();
  });

  it('sends the full pricing set when pricing changes', () => {
    const initial = buildShowFormValuesFromDetail(baseDetail);
    const payload = buildUpdateShowPayload({ ...initial, basePriceRupees: 200 }, initial, false);

    expect(payload?.basePrice).toBe(20000);
    expect(payload?.priceAdjustments).toEqual({
      REGULAR: 0,
      PREMIUM: 5000,
      RECLINER: 0,
      SOFA: 0,
      WHEELCHAIR: -2000,
    });
    expect(payload?.movieId).toBeUndefined();
  });

  it('only sends the schedule when pricing is locked by bookings', () => {
    const initial = buildShowFormValuesFromDetail(baseDetail);
    const payload = buildUpdateShowPayload(
      { ...initial, showTime: '21:00', basePriceRupees: 999, movieId: 'm2' },
      initial,
      true,
    );

    expect(Object.keys(payload ?? {})).toEqual(['startTime']);
  });
});

