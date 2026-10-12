import { ApiError } from './ApiError';

export const getErrorMessage = (e: unknown): string =>
  e instanceof ApiError ? e.message : 'Something went wrong';
