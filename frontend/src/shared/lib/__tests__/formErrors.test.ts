import { describe, it, expect, vi } from 'vitest';
import { setFormServerErrors } from '../formErrors';
import { ApiError } from '../ApiError';

describe('setFormServerErrors', () => {
  it('maps field errors onto form fields and focuses the first field', () => {
    const setError = vi.fn();
    const error = new ApiError('Validation failed', 400, {
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: {
        issues: [
          { path: ['name'], message: 'Name is required' },
          { path: ['email'], message: 'Invalid email' },
        ],
      },
    }, {
      isRecognizedBackendError: true,
      fieldErrors: {
        name: 'Name is required',
        email: 'Invalid email',
      },
    });

    const result = setFormServerErrors(setError, error);

    expect(setError).toHaveBeenCalledTimes(2);
    expect(setError).toHaveBeenNthCalledWith(
      1,
      'name',
      { type: 'server', message: 'Name is required' },
      { shouldFocus: true },
    );
    expect(setError).toHaveBeenNthCalledWith(
      2,
      'email',
      { type: 'server', message: 'Invalid email' },
      { shouldFocus: false },
    );
    expect(result.generalMessage).toBeNull();
    expect(result.unmappedErrors).toHaveLength(0);
  });

  it('maps conflict details.field error directly to the target form field', () => {
    const setError = vi.fn();
    const error = new ApiError('A theatre with this licence number already exists', 409, {
      success: false,
      code: 'CONFLICT',
      message: 'A theatre with this licence number already exists',
      details: { field: 'licenseNumber' },
    }, {
      isRecognizedBackendError: true,
      fieldErrors: {
        licenseNumber: 'A theatre with this licence number already exists',
      },
    });

    const result = setFormServerErrors(setError, error);

    expect(setError).toHaveBeenCalledWith(
      'licenseNumber',
      { type: 'server', message: 'A theatre with this licence number already exists' },
      { shouldFocus: true },
    );
    expect(result.generalMessage).toBeNull();
  });

  it('handles field aliases', () => {
    const setError = vi.fn();
    const error = new ApiError('Invalid language', 400, undefined, {
      fieldErrors: {
        languages: 'Language is required',
      },
    });

    setFormServerErrors(setError, error, {
      fieldAliases: {
        languages: 'languageIds' as any,
      },
    });

    expect(setError).toHaveBeenCalledWith(
      'languageIds',
      { type: 'server', message: 'Language is required' },
      { shouldFocus: true },
    );
  });

  it('returns unmapped errors if field is not in knownFields', () => {
    const setError = vi.fn();
    const error = new ApiError('Bad request', 400, undefined, {
      fieldErrors: {
        unknownProp: 'Invalid property',
      },
    });

    const result = setFormServerErrors(setError, error, {
      knownFields: ['name', 'email'],
    });

    expect(setError).not.toHaveBeenCalled();
    expect(result.unmappedErrors).toContain('unknownProp: Invalid property');
    expect(result.generalMessage).toBe('Bad request');
  });

  it('returns safe fallback for 500 error in banner without setting field errors', () => {
    const setError = vi.fn();
    const error = new ApiError('Something went wrong. Please try again.', 500);

    const result = setFormServerErrors(setError, error);

    expect(setError).not.toHaveBeenCalled();
    expect(result.generalMessage).toBe('Something went wrong. Please try again.');
  });
});

