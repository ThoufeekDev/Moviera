import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Is this error created from AppError?
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
