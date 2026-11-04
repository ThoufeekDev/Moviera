import { describe, it, expect } from 'vitest';
import { mapScreenServerError } from '../mapScreenServerError';
import { ApiError } from '@/shared/lib/ApiError';

describe('mapScreenServerError', () => {
  it('maps to the field named in details.field', () => {
    const error = new ApiError('Screen with this name already exists in this theatre', 409, {
      success: false,
      code: 'CONFLICT',
      message: 'Screen with this name already exists in this theatre',
      details: { field: 'name' },
    });

    expect(mapScreenServerError(error)).toEqual({
      field: 'name',
      message: 'Screen with this name already exists in this theatre',
    });
  });

  it('returns a banner error when details.field is missing, even if the message mentions a field', () => {
    const error = new ApiError('You are not assigned to manage this theatre name', 403, {
      success: false,
      code: 'FORBIDDEN',
      message: 'You are not assigned to manage this theatre name',
    });

    expect(mapScreenServerError(error)).toEqual({
      serverError: 'You are not assigned to manage this theatre name',
    });
  });

  it('returns a banner error when details.field is not a form field', () => {
    const error = new ApiError('Invalid theatre', 400, {
      success: false,
      message: 'Invalid theatre',
      details: { field: 'theatreId' },
    });

    expect(mapScreenServerError(error)).toEqual({ serverError: 'Invalid theatre' });
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(mapScreenServerError(new Error('boom'))).toEqual({
      serverError: 'Failed to create screen. Please try again.',
    });
    expect(mapScreenServerError('oops')).toEqual({
      serverError: 'Failed to create screen. Please try again.',
    });
  });
});

