import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import multer from 'multer';
import { DomainError } from '../domain/errors/DomainError';
import { AppError } from '../errors/AppError';
import { HttpStatusCode } from '../http/HttpStatusCode';
import { errorResponse } from '../utils/apiResponse';
import Sentry from '../infrastructure/monitoring/sentry';
import { Prisma } from '@prisma/client';
import { MAX_FILE_SIZE_MB } from './upload.middleware';
export const errorHandler = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
// !This prevents the handler from trying to send a second response after Express
// ! has already started sending one.
  if (res.headersSent) {
    return next(error)
  }
  if (error instanceof ZodError) {
    return errorResponse(
      res,
      HttpStatusCode.BAD_REQUEST,
      false,
      'Validation failed',
      'VALIDATION_ERROR',
      error.issues,
    );
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, HttpStatusCode.BAD_REQUEST, false, `File size must not exceed ${MAX_FILE_SIZE_MB}`);
    }

    return errorResponse(res, HttpStatusCode.BAD_REQUEST, false, error.message);
  }

if (error instanceof AppError) {
  return errorResponse(
    res,
    error.statusCode,
    false,
    error.message,
    error.code,
    error.details,
  );
}

  if (error instanceof DomainError) {
    return errorResponse(res, HttpStatusCode.BAD_REQUEST, false, error.message, 'DOMAIN_ERROR');
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return errorResponse(
        res,
        HttpStatusCode.CONFLICT,
        false,
        'Resource already exists',
        'CONFLICT',
      );
    }

    if (error.code === 'P2025') {
      return errorResponse(res, HttpStatusCode.NOT_FOUND, false, 'Resource not found', 'NOT_FOUND');
    }

    if (error.code === 'P2003') {
      return errorResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        false,
        'Related resource does not exist',
        'BAD_REFERENCE',
      );
    }
  }

  if (
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError ||
    error instanceof NotBeforeError
  ) {
    return errorResponse(res, HttpStatusCode.UNAUTHORIZED, false, 'Invalid or expired token');
  }

  const errorType = (error as { type?: string } | null)?.type;

  if (errorType === 'entity.parse.failed') {
    return errorResponse(
      res,
      HttpStatusCode.BAD_REQUEST,
      false,
      'Malformed JSON body',
      'INVALID_JSON',
    );
  }

  if (errorType === 'entity.too.large') {
    return errorResponse(
      res,
      HttpStatusCode.PAYLOAD_TOO_LARGE,
      false,
      'Request body too large',
      'PAYLOAD_TOO_LARGE',
    );
  }

  console.error(error);
  Sentry.captureException(error);

  return errorResponse(
    res,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    false,
    'Internal Server Error',
    'INTERNAL_ERROR',
  );
};

// Zod
// → Multer
// → AppError
// → DomainError
// → Prisma
// → JWT
// → malformed JSON
// → oversized body
// → unknown 500
