import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.BAD_REQUEST,"BAD_REQUEST");
  }
}
