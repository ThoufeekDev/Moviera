import { describe, expect, it } from 'vitest';
import { SeatType } from '../../../theatre';
import { createShowSchema } from './CreateShowSchema';
import { listShowsQuerySchema } from './ListShowsSchema';
import { updateShowSchema } from './UpdateShowSchema';

describe('Show Presentation Schemas', () => {
  describe('createShowSchema', () => {
    it('validates a valid create show payload', () => {
      const parsed = createShowSchema.parse({
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-1',
        startTime: '2026-12-10T10:00:00.000Z',
        basePrice: 20000,
        priceAdjustments: {
          [SeatType.REGULAR]: 0,
          [SeatType.PREMIUM]: 5000,
          [SeatType.WHEELCHAIR]: -5000,
        },
      });

      expect(parsed.basePrice).toBe(20000);
      expect(parsed.startTime).toBeInstanceOf(Date);
    });

    it('rejects when basePrice + adjustment is below 100 paise (₹1)', () => {
      const result = createShowSchema.safeParse({
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-1',
        startTime: '2026-12-10T10:00:00.000Z',
        basePrice: 10000,
        priceAdjustments: {
          [SeatType.WHEELCHAIR]: -9950,
        },
      });

      expect(result.success).toBe(false);
    });

    it('rejects when endTime is not after startTime', () => {
      const result = createShowSchema.safeParse({
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-1',
        startTime: '2026-12-10T12:00:00.000Z',
        endTime: '2026-12-10T10:00:00.000Z',
        basePrice: 20000,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('updateShowSchema', () => {
    it('rejects empty update payload', () => {
      const result = updateShowSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('accepts partial update payload', () => {
      const result = updateShowSchema.safeParse({
        basePrice: 25000,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('listShowsQuerySchema', () => {
    it('applies defaults for status, page, and limit', () => {
      const parsed = listShowsQuerySchema.parse({});
      expect(parsed).toEqual({
        status: 'ALL',
        page: 1,
        limit: 20,
      });
    });
  });
});

