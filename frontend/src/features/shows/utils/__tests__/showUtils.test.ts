import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SEAT_ADJUSTMENTS_RUPEES,
  createShowFormSchema,
} from '../../schemas/createShowForm.schema';
import type { ShowListItem } from '../../types/show.types';
import { buildCreateShowPayload } from '../buildCreateShowPayload';
import { mapShowServerFieldToFormField } from '../mapShowServerErrorToField';
import {
  computeSeatCategoryPrices,
  computeShowPriceRangeRupees,
  rupeesToPaise,
} from '../showPricing.utils';
import {
  calculateShowEndTime,
  combineDateAndTime,
  evaluateScreenScheduleSlot,
} from '../showScheduling.utils';

describe('Shows Frontend Pure Utils & Schema', () => {
  describe('showPricing.utils', () => {
    it('calculates category final prices and price range matching screenshot example (Base ₹150, Range ₹130 - ₹350)', () => {
      const categories = computeSeatCategoryPrices(
        150,
        DEFAULT_SEAT_ADJUSTMENTS_RUPEES,
      );

      expect(categories.map((c) => ({ type: c.seatType, final: c.finalPriceRupees }))).toEqual([
        { type: 'REGULAR', final: 150 },
        { type: 'PREMIUM', final: 200 },
        { type: 'RECLINER', final: 300 },
        { type: 'SOFA', final: 350 },
        { type: 'WHEELCHAIR', final: 130 },
      ]);

      const range = computeShowPriceRangeRupees(150, DEFAULT_SEAT_ADJUSTMENTS_RUPEES);
      expect(range).toEqual({ minRupees: 130, maxRupees: 350 });
      expect(rupeesToPaise(150)).toBe(15000);
      expect(rupeesToPaise(-20)).toBe(-2000);
    });
  });

  describe('showScheduling.utils', () => {
    it('computes endTime from startTime + movie duration and detects conflicts with cleaning buffer', () => {
      const startTime = combineDateAndTime('2026-01-28', '19:30');
      const endTime = calculateShowEndTime(startTime, 181);

      expect(startTime).not.toBeNull();
      expect(endTime).not.toBeNull();
      expect(endTime!.getTime() - startTime!.getTime()).toBe(181 * 60_000);

      const previousShow = {
        id: 'show-prev',
        status: 'PUBLISHED',
        startTime: new Date(
          startTime!.getTime() - 5 * 60 * 60_000,
        ).toISOString(),
        endTime: new Date(
          startTime!.getTime() - 2.5 * 60 * 60_000,
        ).toISOString(),
        basePrice: 15000,
        movie: {
          id: 'm1',
          title: 'Previous Movie',
          posterUrl: null,
          duration: 150,
          languages: ['English'],
          certification: 'UA',
        },
        screen: { id: 's1', name: 'Screen 1', totalSeats: 300 },
        theatre: { id: 't1', name: 'Galaxy Cinemas', cityName: 'Kochi' },
        cinemaFormat: { id: 'f1', name: '2D', slug: '2d' },
        seatSummary: { totalSeats: 300, availableSeats: 300, bookedSeats: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies ShowListItem;

      const noConflictEval = evaluateScreenScheduleSlot({
        startTime,
        endTime,
        cleaningBufferMinutes: 15,
        existingShows: [previousShow],
      });

      expect(noConflictEval.hasConflict).toBe(false);
      expect(noConflictEval.previousShow?.id).toBe('show-prev');

      // Show ending only 10 minutes before candidate startTime (conflicts with 15m cleaning buffer)
      const conflictingShow: ShowListItem = {
        ...previousShow,
        id: 'show-conflict',
        endTime: new Date(startTime!.getTime() - 10 * 60_000).toISOString(),
      };

      const conflictEval = evaluateScreenScheduleSlot({
        startTime,
        endTime,
        cleaningBufferMinutes: 15,
        existingShows: [conflictingShow],
      });

      expect(conflictEval.hasConflict).toBe(true);
      expect(conflictEval.conflictingShow?.id).toBe('show-conflict');
    });
  });

  describe('createShowFormSchema & buildCreateShowPayload', () => {
    it('validates form values and builds paise-based API payload', () => {
      const parsed = createShowFormSchema.parse({
        theatreId: 'theatre-1',
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        showDate: '2026-01-28',
        showTime: '19:30',
        basePriceRupees: 150,
        priceAdjustmentsRupees: DEFAULT_SEAT_ADJUSTMENTS_RUPEES,
      });

      const payload = buildCreateShowPayload(parsed);

      expect(payload.basePrice).toBe(15000);
      expect(payload.priceAdjustments).toEqual({
        REGULAR: 0,
        PREMIUM: 5000,
        RECLINER: 15000,
        SOFA: 20000,
        WHEELCHAIR: -2000,
      });
    });

    it('rejects when negative adjustment drops final seat price below ₹1', () => {
      const res = createShowFormSchema.safeParse({
        theatreId: 'theatre-1',
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        showDate: '2026-01-28',
        showTime: '19:30',
        basePriceRupees: 150,
        priceAdjustmentsRupees: {
          ...DEFAULT_SEAT_ADJUSTMENTS_RUPEES,
          WHEELCHAIR: -150, // 150 - 150 = ₹0 (< ₹1)
        },
      });

      expect(res.success).toBe(false);
    });

    it('maps backend field names to form fields', () => {
      expect(mapShowServerFieldToFormField('startTime')).toBe('showTime');
      expect(mapShowServerFieldToFormField('basePrice')).toBe('basePriceRupees');
      expect(mapShowServerFieldToFormField('screenId')).toBe('screenId');
    });
  });
});

