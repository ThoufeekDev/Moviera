import { describe, it, expect } from 'vitest';
import { createScreenSchema } from './CreateScreenSchema';
import { listScreensQuerySchema } from './ListScreenSchema';

describe('Screen schemas', () => {
  describe('createScreenSchema', () => {
    it('accepts a valid payload and trims values', () => {
      const result = createScreenSchema.safeParse({ theatreId: ' theatre-1 ', name: '  Audi 1  ' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ theatreId: 'theatre-1', name: 'Audi 1' });
    });

    it('strips unknown keys such as server-owned fields', () => {
      const result = createScreenSchema.safeParse({
        theatreId: 'theatre-1',
        name: 'Audi 1',
        slug: 'hacked',
        isActive: false,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ theatreId: 'theatre-1', name: 'Audi 1' });
    });

    it('rejects a blank name', () => {
      const result = createScreenSchema.safeParse({ theatreId: 'theatre-1', name: '   ' });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe('Screen name is required');
    });

    it('rejects a name longer than 100 characters and accepts exactly 100', () => {
      expect(
        createScreenSchema.safeParse({ theatreId: 'theatre-1', name: 'a'.repeat(101) }).success,
      ).toBe(false);
      expect(
        createScreenSchema.safeParse({ theatreId: 'theatre-1', name: 'a'.repeat(100) }).success,
      ).toBe(true);
    });

    it('rejects a missing theatreId', () => {
      const result = createScreenSchema.safeParse({ name: 'Audi 1' });

      expect(result.success).toBe(false);
    });
  });

  describe('listScreensQuerySchema', () => {
    it('applies defaults', () => {
      expect(listScreensQuerySchema.parse({})).toEqual({ status: 'ALL', page: 1, limit: 20 });
    });

    it('coerces numeric strings and trims search', () => {
      expect(
        listScreensQuerySchema.parse({ search: '  audi ', status: 'INACTIVE', page: '2', limit: '50' }),
      ).toEqual({ search: 'audi', status: 'INACTIVE', page: 2, limit: 50 });
    });

    it('rejects an unknown status', () => {
      expect(listScreensQuerySchema.safeParse({ status: 'ARCHIVED' }).success).toBe(false);
    });

    it('rejects page below 1 and limit outside 1 to 100', () => {
      expect(listScreensQuerySchema.safeParse({ page: '0' }).success).toBe(false);
      expect(listScreensQuerySchema.safeParse({ limit: '0' }).success).toBe(false);
      expect(listScreensQuerySchema.safeParse({ limit: '101' }).success).toBe(false);
    });

    it('strips unknown keys', () => {
      expect(listScreensQuerySchema.parse({ theatreId: 'other' })).toEqual({
        status: 'ALL',
        page: 1,
        limit: 20,
      });
    });
  });
});

