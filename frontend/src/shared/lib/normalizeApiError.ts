import axios from 'axios';
import { ApiError, type ApiErrorResponse } from './ApiError';

export const FALLBACK_SERVER_MESSAGE = 'Something went wrong. Please try again.';
export const FALLBACK_NETWORK_MESSAGE = "Can't reach the server. Check your connection and try again.";

const isPlainObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const isBackendEnvelope = (data: unknown): data is ApiErrorResponse => {
  if (!isPlainObject(data)) return false;
  return data.success === false && typeof data.message === 'string';
};

const isSafeString = (msg: unknown): msg is string => {
  if (typeof msg !== 'string') return false;
  const trimmed = msg.trim();
  if (!trimmed || trimmed.length > 300) return false;
  // Reject HTML/markup
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return false;
  // Reject stack traces or internal database traces
  if (/at\s+.+:\d+:\d+/i.test(trimmed) || /prisma/i.test(trimmed) || /select\s+.+\s+from/i.test(trimmed)) {
    return false;
  }
  return true;
};

const extractFieldErrorsFromDetails = (details: unknown): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  if (!details) return fieldErrors;

  // Single field error (e.g., details: { field: "name" })
  if (isPlainObject(details) && typeof details.field === 'string') {
    // Will be paired with the primary error message by the caller if needed
  }

  const parseIssuesList = (issues: unknown[]) => {
    for (const item of issues) {
      if (isPlainObject(item) && typeof item.message === 'string') {
        const pathArray = Array.isArray(item.path) ? item.path : [];
        if (pathArray.length > 0) {
          const pathKey = pathArray.map(String).join('.');
          if (!fieldErrors[pathKey]) {
            fieldErrors[pathKey] = item.message;
          }
        }
      }
    }
  };

  if (Array.isArray(details)) {
    parseIssuesList(details);
  } else if (isPlainObject(details)) {
    if (Array.isArray(details.issues)) parseIssuesList(details.issues);
    if (Array.isArray(details.body)) parseIssuesList(details.body);
    if (Array.isArray(details.params)) parseIssuesList(details.params);
    if (Array.isArray(details.query)) parseIssuesList(details.query);
  }

  return fieldErrors;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const response = error.response;

    // 1. Network failure / timeout (no response received)
    if (!response) {
      return new ApiError(
        FALLBACK_NETWORK_MESSAGE,
        0,
        undefined,
        {
          code: 'NETWORK_ERROR',
          isRecognizedBackendError: false,
          fieldErrors: {},
        },
      );
    }

    const statusCode = response.status;
    const data = response.data;
    const recognized = isBackendEnvelope(data);

    // 2. 5xx or server errors: NEVER expose raw message or internal stack trace
    if (statusCode >= 500) {
      return new ApiError(
        FALLBACK_SERVER_MESSAGE,
        statusCode,
        recognized ? data : undefined,
        {
          code: recognized ? data.code : 'INTERNAL_ERROR',
          isRecognizedBackendError: recognized,
          fieldErrors: {},
        },
      );
    }

    // 3. Non-JSON body or non-envelope response
    if (!recognized) {
      return new ApiError(
        FALLBACK_SERVER_MESSAGE,
        statusCode,
        undefined,
        {
          code: 'UNRECOGNIZED_RESPONSE',
          isRecognizedBackendError: false,
          fieldErrors: {},
        },
      );
    }

    // 4. Recognized backend envelope (status < 500)
    let message = isSafeString(data.message) ? data.message : FALLBACK_SERVER_MESSAGE;
    const fieldErrors = extractFieldErrorsFromDetails(data.details);

    // If validation failed, check if details has issues with a safe first message
    if (message === 'Validation failed' && data.details) {
      const details = data.details as Record<string, unknown> | unknown[];
      const issues = Array.isArray(details)
        ? details
        : ((details as Record<string, unknown>)?.issues ||
           (details as Record<string, unknown>)?.body) as unknown[];

      if (Array.isArray(issues) && issues.length > 0) {
        const first = issues[0] as { message?: string };
        if (first?.message && isSafeString(first.message)) {
          message = first.message;
        }
      }
    }

    // Single field error support (details: { field: "licenseNumber" })
    if (isPlainObject(data.details) && typeof data.details.field === 'string') {
      const field = data.details.field;
      if (!fieldErrors[field]) {
        fieldErrors[field] = message;
      }
    }

    return new ApiError(
      message,
      statusCode,
      data,
      {
        code: data.code,
        isRecognizedBackendError: true,
        fieldErrors,
      },
    );
  }

  if (error instanceof ApiError) {
    if (Object.keys(error.fieldErrors).length === 0 && error.response?.details) {
      const fieldErrors = extractFieldErrorsFromDetails(error.response.details);
      if (isPlainObject(error.response.details) && typeof error.response.details.field === 'string') {
        const field = error.response.details.field;
        if (!fieldErrors[field]) {
          fieldErrors[field] = error.message;
        }
      }
      error.fieldErrors = fieldErrors;
    }
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(
      isSafeString(error.message) ? error.message : FALLBACK_SERVER_MESSAGE,
      500,
      undefined,
      {
        code: 'CLIENT_ERROR',
        isRecognizedBackendError: false,
        fieldErrors: {},
      },
    );
  }

  return new ApiError(FALLBACK_SERVER_MESSAGE, 500, undefined, {
    code: 'UNKNOWN_ERROR',
    isRecognizedBackendError: false,
    fieldErrors: {},
  });
};
