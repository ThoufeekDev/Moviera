import axios from 'axios';
import { ApiError } from './ApiError';

export interface FormErrorResult {
  generalMessage: string | null;
  fieldErrors: Record<string, string>;
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

  // ── Case 1: Axios HTTP Error Response ───────────────────────────────────────
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as {
      message?: string;
      code?: string;
      details?: unknown;
    };

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

    const details = data.details as Record<string, unknown> | unknown[] | undefined;
    if (details) {
      if (Array.isArray(details)) {
        parseIssues(details);
      } else if (typeof details === 'object') {
        const bodyObj = (details as { body?: { issues?: unknown[] } }).body;
        if (bodyObj && Array.isArray(bodyObj.issues)) {
          parseIssues(bodyObj.issues);
        }

        const issuesDirect = (details as { issues?: unknown[] }).issues;
        if (Array.isArray(issuesDirect)) {
          parseIssues(issuesDirect);
        }
      }
    }

    if (data.message && data.message !== 'Validation failed') {
      result.generalMessage = data.message;
    } else if (firstIssueMessage) {
      result.generalMessage = firstIssueMessage;
    } else if (data.message) {
      result.generalMessage = data.message;
    } else {
      result.generalMessage = fallbackMessage;
    }

    return result;
  }

  // ── Case 2: Custom ApiError or Standard Error ───────────────────────────────
  if (error instanceof ApiError || error instanceof Error) {
    result.generalMessage = error.message || fallbackMessage;
    return result;
  }

  // ── Case 3: Raw string or other ─────────────────────────────────────────────
  result.generalMessage = typeof error === 'string' ? error : fallbackMessage;
  return result;
};
