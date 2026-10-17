import { ApiError } from '@/shared/lib/ApiError';
import type { FormValues } from '../schemas/createTheatreForm.schema';

export type MappedFieldError =
  | { field: keyof FormValues; message: string; serverError?: never }
  | { serverError: string; field?: never; message?: never };

export function mapServerErrorToField(
  error: unknown,
  values: Pick<FormValues, 'cityId'>,
): MappedFieldError {
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to create theatre. Please check the inputs and try again.';

  const lowerMsg = errorMessage.toLowerCase();
  if (lowerMsg.includes('name')) {
    return { field: 'name', message: errorMessage };
  }
  if (lowerMsg.includes('licence') || lowerMsg.includes('license')) {
    return { field: 'licenseNumber', message: errorMessage };
  }
  if (lowerMsg.includes('city')) {
    if (values.cityId) {
      return { field: 'cityId', message: errorMessage };
    }
    return { field: 'cityName', message: errorMessage };
  }
  return { serverError: errorMessage };
}
