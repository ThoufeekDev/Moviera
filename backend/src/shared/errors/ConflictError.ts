import { HttpStatusCode } from '../http/HttpStatusCode';
import { AppError } from './AppError';

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.CONFLICT,"CONFLICT");
  }
}
