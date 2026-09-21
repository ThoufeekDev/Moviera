import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Is this error created from AppError?
  if (error instanceof AppError) {
    return errorResponse(res, error.statusCode, false, error.message);
  }

  if (
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError ||
    error instanceof NotBeforeError
  ) {
    return errorResponse(res, 401, false, 'Invalid or expired token');
  }

  console.error(error);

  return errorResponse(res, 500, false, "Internal Server Error");
};


