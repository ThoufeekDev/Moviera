import { AppError } from "./AppError";
import { HttpStatusCode } from "../http/HttpStatusCode";

export class ValidationError extends AppError {
  constructor(details: unknown, customMessage?: string) {
    let message = customMessage;

    if (!message && typeof details === 'object' && details !== null) {
      const dict = details as Record<string, unknown>;
      const issues = (dict.issues || dict.body || dict.params || dict.query) as unknown[];
      if (Array.isArray(issues) && issues.length > 0) {
        const first = issues[0] as { message?: string };
        if (first?.message) {
          message = first.message;
        }
      }
    }

    super(
      message || "Validation failed",
      HttpStatusCode.BAD_REQUEST,
      "VALIDATION_ERROR",
      details,
    );
  }
}