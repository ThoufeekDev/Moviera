import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  normalizeApiError,
  FALLBACK_SERVER_MESSAGE,
  FALLBACK_NETWORK_MESSAGE,
} from '../normalizeApiError';

describe('normalizeApiError', () => {
  it('handles recognized backend envelope correctly (status < 500)', () => {
    const error = new AxiosError('Request failed with status code 400');
    error.response = {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Name is required',
        details: {
          issues: [{ path: ['name'], message: 'Name is required' }],
        },
      },
    };

    const result = normalizeApiError(error);

    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Name is required');
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.isRecognizedBackendError).toBe(true);
    expect(result.fieldErrors).toEqual({ name: 'Name is required' });
  });

  it('handles network errors with no response using safe connection message', () => {
    const error = new AxiosError('Network Error');
    // no error.response

    const result = normalizeApiError(error);

    expect(result.statusCode).toBe(0);
    expect(result.message).toBe(FALLBACK_NETWORK_MESSAGE);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.isRecognizedBackendError).toBe(false);
    expect(result.fieldErrors).toEqual({});
  });

  it('handles non-JSON or HTML body using safe fallback message', () => {
    const error = new AxiosError('Request failed with status code 502');
    error.response = {
      status: 502,
      statusText: 'Bad Gateway',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: '<html><body>502 Bad Gateway nginx</body></html>',
    };

    const result = normalizeApiError(error);

    expect(result.statusCode).toBe(502);
    expect(result.message).toBe(FALLBACK_SERVER_MESSAGE);
    expect(result.isRecognizedBackendError).toBe(false);
  });

  it('never exposes internal messages or stack traces for 500 errors', () => {
    const error = new AxiosError('Request failed with status code 500');
    error.response = {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'PrismaClientKnownRequestError: SELECT * FROM users at /app/dist/server.js:142:11',
      },
    };

    const result = normalizeApiError(error);

    expect(result.statusCode).toBe(500);
    expect(result.message).toBe(FALLBACK_SERVER_MESSAGE);
    expect(result.message).not.toContain('Prisma');
    expect(result.message).not.toContain('server.js');
  });

  it('extracts field errors from details.field on conflict (409)', () => {
    const error = new AxiosError('Request failed with status code 409');
    error.response = {
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        success: false,
        code: 'CONFLICT',
        message: 'A theatre with this licence number already exists',
        details: {
          field: 'licenseNumber',
        },
      },
    };

    const result = normalizeApiError(error);

    expect(result.statusCode).toBe(409);
    expect(result.message).toBe('A theatre with this licence number already exists');
    expect(result.code).toBe('CONFLICT');
    expect(result.isRecognizedBackendError).toBe(true);
    expect(result.fieldErrors).toEqual({
      licenseNumber: 'A theatre with this licence number already exists',
    });
  });
});

