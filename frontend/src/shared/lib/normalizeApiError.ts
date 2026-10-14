import axios from 'axios';

import { ApiError, type ApiErrorResponse } from './ApiError';

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const statusCode = error.response?.status ?? 500;
    const data = error.response?.data;

    let message = data?.message ?? error.message ?? 'Something went wrong';

    if (message === 'Validation failed' && data?.details) {
      const details = data.details as Record<string, unknown> | unknown[];
      const issues = Array.isArray(details)
        ? details
        : ((details as Record<string, unknown>)?.issues ||
           (details as Record<string, unknown>)?.body) as unknown[];

      if (Array.isArray(issues) && issues.length > 0) {
        const first = issues[0] as { message?: string };
        if (first?.message) {
          message = first.message;
        }
      }
    }

    return new ApiError(
      message,
      statusCode,
      data,
    );
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError('Something went wrong', 500);
};


// ! Converts different/raw errors into ApiError