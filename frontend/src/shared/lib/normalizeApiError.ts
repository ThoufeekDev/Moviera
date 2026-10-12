import axios from 'axios';

import { ApiError, type ApiErrorResponse } from './ApiError';

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const statusCode = error.response?.status ?? 500;

    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong';

    return new ApiError(
      message,
      statusCode,
      error.response?.data,
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