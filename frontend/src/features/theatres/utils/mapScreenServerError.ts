import { ApiError } from '@/shared/lib/ApiError';
import type { CreateScreenFormValues } from '../schemas/createScreenForm.schema';

export type MappedScreenError =
  | { field: keyof CreateScreenFormValues; message: string; serverError?: never }
  | { serverError: string; field?: never; message?: never };

const FALLBACK_MESSAGE = 'Failed to create screen. Please try again.';
const FORM_FIELDS: ReadonlyArray<keyof CreateScreenFormValues> = ['name'];

const isFormField = (value: unknown): value is keyof CreateScreenFormValues =>
  typeof value === 'string' && (FORM_FIELDS as readonly string[]).includes(value);

const readDetailsField = (details: unknown): unknown =>
  typeof details === 'object' && details !== null && 'field' in details
    ? (details as { field: unknown }).field
    : undefined;

// Uses the API's details.field instead of guessing the field from message text.
export function mapScreenServerError(error: unknown): MappedScreenError {
  if (error instanceof ApiError) {
    const field = readDetailsField(error.response?.details);
    if (isFormField(field)) {
      return { field, message: error.message };
    }
    return { serverError: error.message || FALLBACK_MESSAGE };
  }

  return { serverError: FALLBACK_MESSAGE };
}
