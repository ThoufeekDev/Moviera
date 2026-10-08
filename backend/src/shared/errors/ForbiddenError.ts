import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.FORBIDDEN,"FORBIDDEN");
  }
}
