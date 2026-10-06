import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse';
import Sentry from '../infrastructure/monitoring/sentry';
import { ZodError } from 'zod';
export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {

  if (error instanceof ZodError) {
    return errorResponse(
      res,
      400,
      false,
      error.issues[0]?.message ?? "Validation failed",
    )
  }
  // Is this error created from AppError?
  if (error instanceof AppError) {
    return errorResponse(
      res,
      error.statusCode,
      false,
      error.message);
  }

  if (
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError ||
    error instanceof NotBeforeError
  ) {
    return errorResponse(res, 401, false, 'Invalid or expired token');
  }

  console.error(error);
  Sentry.captureException(error)


  return errorResponse(res, 500, false, "Internal Server Error");
};


