import { describe, it, expect } from 'vitest';
import { buildCreateScreenPayload } from '../buildCreateScreenPayload';

describe('buildCreateScreenPayload', () => {
  it('includes the theatreId and trims the name', () => {
    expect(buildCreateScreenPayload('theatre-1', { name: '  Audi 1 ' })).toEqual({
      theatreId: 'theatre-1',
      name: 'Audi 1',
    });
  });

  it('collapses repeated whitespace inside the name', () => {
    expect(buildCreateScreenPayload('theatre-1', { name: 'IMAX    Screen\t2' })).toEqual({
      theatreId: 'theatre-1',
      name: 'IMAX Screen 2',
    });
  });
});

