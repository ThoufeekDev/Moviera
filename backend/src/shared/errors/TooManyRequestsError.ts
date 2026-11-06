import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests. Try again later.', details?: unknown) {
    super(message, HttpStatusCode.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED', details);
  }
}

