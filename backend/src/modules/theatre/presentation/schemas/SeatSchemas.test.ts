import { describe, it, expect } from 'vitest';
import {
  createSeatSchema,
  bulkCreateSeatsSchema,
} from './CreateSeatSchema';
import { updateSeatLayoutSchema } from './UpdateSeatLayoutSchema';
import { updateSeatSchema } from './UpdateSeatSchema';
import { SeatType } from '../../domain/enums/SeatType';

describe('Seat Schemas', () => {
  describe('createSeatSchema', () => {
    it('validates a valid seat input', () => {
      const parsed = createSeatSchema.safeParse({
        rowLabel: 'A',
        seatNumber: 1,
        x: 0.1,
        y: 0.2,
        type: SeatType.REGULAR,
      });

      expect(parsed.success).toBe(true);
    });

    it('rejects missing rowLabel or negative seatNumber', () => {
      const parsed = createSeatSchema.safeParse({
        rowLabel: '',
        seatNumber: -1,
        x: 0.1,
        y: 0.2,
        type: SeatType.REGULAR,
      });

      expect(parsed.success).toBe(false);
    });
  });

  describe('bulkCreateSeatsSchema', () => {
    it('validates valid row configurations', () => {
      const parsed = bulkCreateSeatsSchema.safeParse({
        rows: [
          { rowLabel: 'A', seatCount: 10, type: SeatType.REGULAR },
          { rowLabel: 'B', seatCount: 10, type: SeatType.PREMIUM },
        ],
      });

      expect(parsed.success).toBe(true);
    });

    it('rejects duplicate row labels', () => {
      const parsed = bulkCreateSeatsSchema.safeParse({
        rows: [
          { rowLabel: 'A', seatCount: 5, type: SeatType.REGULAR },
          { rowLabel: 'a', seatCount: 5, type: SeatType.REGULAR },
        ],
      });

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('Duplicate row labels');
      }
    });

    it('rejects total seats over 1000', () => {
      const rows = Array.from({ length: 25 }, (_, i) => ({
        rowLabel: `R${i}`,
        seatCount: 50,
        type: SeatType.REGULAR,
      })); // 1250 seats

      const parsed = bulkCreateSeatsSchema.safeParse({ rows });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('more than 1000 seats');
      }
    });
  });

  describe('updateSeatLayoutSchema', () => {
    it('validates valid layout coordinates', () => {
      const parsed = updateSeatLayoutSchema.safeParse({
        seats: [{ seatId: 's1', x: 0.5, y: 0.5, rotation: 0 }],
      });

      expect(parsed.success).toBe(true);
    });

    it('rejects coordinates out of bounds [0, 1]', () => {
      const parsed = updateSeatLayoutSchema.safeParse({
        seats: [{ seatId: 's1', x: 1.5, y: -0.1, rotation: 0 }],
      });

      expect(parsed.success).toBe(false);
    });

    it('rejects duplicate seat IDs', () => {
      const parsed = updateSeatLayoutSchema.safeParse({
        seats: [
          { seatId: 's1', x: 0.1, y: 0.1, rotation: 0 },
          { seatId: 's1', x: 0.2, y: 0.2, rotation: 0 },
        ],
      });

      expect(parsed.success).toBe(false);
    });
  });

  describe('updateSeatSchema', () => {
    it('validates partial update of type or isActive', () => {
      expect(updateSeatSchema.safeParse({ type: SeatType.PREMIUM }).success).toBe(true);
      expect(updateSeatSchema.safeParse({ isActive: false }).success).toBe(true);
      expect(updateSeatSchema.safeParse({}).success).toBe(false);
    });
  });
});

