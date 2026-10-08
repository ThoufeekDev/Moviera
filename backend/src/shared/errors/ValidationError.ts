import { AppError } from "./AppError";
import { HttpStatusCode } from "../http/HttpStatusCode";

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super(
      "Validation failed",
      HttpStatusCode.BAD_REQUEST,
      "VALIDATION_ERROR",
      details,
    );
  }
}