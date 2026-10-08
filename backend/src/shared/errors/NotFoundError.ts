import { AppError } from './AppError';
import { HttpStatusCode } from '../http/HttpStatusCode';
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.NOT_FOUND,"NOT_FOUND");
  }
}
