import { describe, it, expect } from 'vitest';
import { createScreenFormSchema } from '../createScreenForm.schema';

describe('createScreenFormSchema', () => {
  it('accepts a valid name and trims it', () => {
    const result = createScreenFormSchema.safeParse({ name: '  Audi 1  ' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'Audi 1' });
  });

  it('rejects a blank name', () => {
    const result = createScreenFormSchema.safeParse({ name: '   ' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Screen name is required');
  });

  it('rejects names longer than 100 characters and accepts exactly 100', () => {
    expect(createScreenFormSchema.safeParse({ name: 'a'.repeat(101) }).success).toBe(false);
    expect(createScreenFormSchema.safeParse({ name: 'a'.repeat(100) }).success).toBe(true);
  });

  it('rejects names without any letter or number', () => {
    const result = createScreenFormSchema.safeParse({ name: '!!!' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      'Screen name must contain at least one letter or number',
    );
  });

  it('strips unknown keys', () => {
    const result = createScreenFormSchema.safeParse({ name: 'Audi 1', slug: 'x' });
    expect(result.data).toEqual({ name: 'Audi 1' });
  });
});

