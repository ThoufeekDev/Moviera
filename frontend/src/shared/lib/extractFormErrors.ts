import axios from 'axios';
import { ApiError } from './ApiError';

export interface FormErrorResult {
  generalMessage: string | null;
  fieldErrors: Record<string, string>;
}

interface ErrorPayload {
  message?: string;
  code?: string;
  details?: unknown;
}

export const extractFormErrors = (
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again.',
): FormErrorResult => {
  const result: FormErrorResult = {
    generalMessage: null,
    fieldErrors: {},
  };

  if (!error) return result;

  // ── Step 1: Resolve payload data from AxiosError, ApiError, or plain object ──
  let data: ErrorPayload | null = null;

  if (axios.isAxiosError(error) && error.response?.data) {
    data = error.response.data as ErrorPayload;
  } else if (error instanceof ApiError && error.response) {
    data = error.response as ErrorPayload;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    (error as { response?: { data?: unknown } }).response?.data
  ) {
    data = (error as { response: { data: ErrorPayload } }).response.data;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    ('details' in error || 'message' in error)
  ) {
    data = error as unknown as ErrorPayload;
  }

  let firstIssueMessage: string | null = null;

  const parseIssues = (issues: unknown[]) => {
    for (const item of issues) {
      if (typeof item === 'object' && item !== null) {
        const issue = item as { path?: unknown[]; message?: string };
        if (issue.message) {
          if (!firstIssueMessage) {
            firstIssueMessage = issue.message;
          }
          if (Array.isArray(issue.path) && issue.path.length > 0) {
            const fieldName = String(issue.path[issue.path.length - 1]);
            if (!result.fieldErrors[fieldName]) {
              result.fieldErrors[fieldName] = issue.message;
            }
          }
        }
      }
    }
  };

  if (data) {
    const details = data.details as Record<string, unknown> | unknown[] | undefined;

    if (details) {
      if (Array.isArray(details)) {
        parseIssues(details);
      } else if (typeof details === 'object') {
        // Direct flat issues array: { issues: [...] }
        if (Array.isArray(details.issues)) {
          parseIssues(details.issues);
        }

        // Body issues: { body: [...] } or { body: { issues: [...] } } or { body: { message: "[...]" } }
        if (Array.isArray(details.body)) {
          parseIssues(details.body);
        } else if (typeof details.body === 'object' && details.body !== null) {
          const bodyObj = details.body as { issues?: unknown[]; message?: string };
          if (Array.isArray(bodyObj.issues)) {
            parseIssues(bodyObj.issues);
          } else if (typeof bodyObj.message === 'string') {
            try {
              const parsed = JSON.parse(bodyObj.message);
              if (Array.isArray(parsed)) {
                parseIssues(parsed);
              }
            } catch {
              // Ignore non-JSON
            }
          }
        }

        // Params issues: { params: [...] }
        if (Array.isArray(details.params)) {
          parseIssues(details.params);
        }

        // Query issues: { query: [...] }
        if (Array.isArray(details.query)) {
          parseIssues(details.query);
        }
      }
    }

    // Determine the general error message
    const msg = data.message || (error instanceof Error ? error.message : null);

    if (msg && msg !== 'Validation failed') {
      result.generalMessage = msg;
    } else if (firstIssueMessage) {
      result.generalMessage = firstIssueMessage;
    } else if (msg) {
      result.generalMessage = msg;
    } else {
      result.generalMessage = fallbackMessage;
    }

    // Smart business mapping: If no field errors were extracted from issues,
    // map common domain business rule errors to the corresponding field:
    if (Object.keys(result.fieldErrors).length === 0 && result.generalMessage) {
      const lower = result.generalMessage.toLowerCase();
      if (lower.includes('primary manager')) {
        result.fieldErrors.role = result.generalMessage;
      } else if (lower.includes('suspended')) {
        result.fieldErrors.email = result.generalMessage;
      } else if (
        lower.includes('already assigned') ||
        lower.includes('already exists') ||
        lower.includes('already exist')
      ) {
        result.fieldErrors.email = result.generalMessage;
        result.fieldErrors.userId = result.generalMessage;
      } else if (lower.includes('theatre') || lower.includes('cinema')) {
        result.fieldErrors.theatreId = result.generalMessage;
      } else if (lower.includes('phone')) {
        result.fieldErrors.phone = result.generalMessage;
      } else if (lower.includes('name')) {
        result.fieldErrors.name = result.generalMessage;
      } else if (lower.includes('user')) {
        result.fieldErrors.userId = result.generalMessage;
      }
    }

    return result;
  }

  // ── Step 2: Fallback for Error instances without data payload ─────────────
  if (error instanceof Error) {
    result.generalMessage = error.message || fallbackMessage;
    return result;
  }

  // ── Step 3: Raw string or other ───────────────────────────────────────────
  result.generalMessage = typeof error === 'string' ? error : fallbackMessage;
  return result;
};
