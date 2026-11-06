import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from './ApiError';
import { normalizeApiError } from './normalizeApiError';

export interface SetFormServerErrorsOptions<TFieldValues extends FieldValues = FieldValues> {
  fieldAliases?: Record<string, Path<TFieldValues>>;
  knownFields?: ReadonlyArray<string> | readonly string[];
}

export interface SetFormServerErrorsResult {
  generalMessage: string | null;
  unmappedErrors: string[];
}

/**
 * Maps server-side validation and business conflict errors directly onto form fields
 * using Zod issue paths and details.field.
 *
 * Sets the matching field error via React Hook Form's setError (focusing the first errored field).
 * Unmapped errors are returned to be displayed in a FormErrorBanner.
 */
export function setFormServerErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  rawError: unknown,
  options: SetFormServerErrorsOptions<TFieldValues> = {},
): SetFormServerErrorsResult {
  const error = rawError instanceof ApiError ? rawError : normalizeApiError(rawError);

  const fieldErrors = error.fieldErrors ?? {};
  const unmappedErrors: string[] = [];
  let firstFieldFocused = false;
  let mappedFieldCount = 0;

  for (const [rawKey, message] of Object.entries(fieldErrors)) {
    const targetKey = (options.fieldAliases?.[rawKey] ?? rawKey) as Path<TFieldValues>;

    // If knownFields list is provided, verify the key is valid for this form
    if (options.knownFields && !options.knownFields.includes(targetKey as string)) {
      unmappedErrors.push(`${rawKey}: ${message}`);
      continue;
    }

    try {
      setError(
        targetKey,
        { type: 'server', message },
        { shouldFocus: !firstFieldFocused },
      );
      firstFieldFocused = true;
      mappedFieldCount++;
    } catch {
      unmappedErrors.push(`${rawKey}: ${message}`);
    }
  }

  let generalMessage: string | null = null;

  // If validation or conflict mapped directly to a field, we do not need to repeat
  // the exact same message in the banner unless there were unmapped errors or no fields were mapped.
  if (mappedFieldCount === 0 || unmappedErrors.length > 0) {
    generalMessage = error.message;
  } else if (error.statusCode >= 500 || error.statusCode === 403 || error.statusCode === 401) {
    generalMessage = error.message;
  }

  return {
    generalMessage,
    unmappedErrors,
  };
}

