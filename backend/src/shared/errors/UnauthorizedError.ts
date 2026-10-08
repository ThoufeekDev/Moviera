import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.UNAUTHORIZED,"UNAUTHORIZED");
  }
}
