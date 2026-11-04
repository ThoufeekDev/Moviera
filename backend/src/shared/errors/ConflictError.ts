import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, HttpStatusCode.CONFLICT, "CONFLICT", details);
  }
}
