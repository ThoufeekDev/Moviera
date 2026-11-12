import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, HttpStatusCode.BAD_REQUEST, "BAD_REQUEST", details);
  }
}
