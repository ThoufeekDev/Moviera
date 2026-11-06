import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import multer from 'multer';
import { errorHandler } from './errrorHandler';
import { TooManyRequestsError } from '../errors/TooManyRequestsError';
import { ValidationError } from '../errors/ValidationError';
import { z } from 'zod';

describe('Global Error Handler Contract', () => {
  const createMockRes = () => {
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
  };

  const mockReq = {} as Request;
  const mockNext = vi.fn() as NextFunction;

  it('handles TooManyRequestsError (429) with RATE_LIMIT_EXCEEDED and no trailing spaces', () => {
    const res = createMockRes();
    const error = new TooManyRequestsError('Too many OTP requests. Try again later.');

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many OTP requests. Try again later.',
    });
    // Check no trailing whitespace
    const jsonCall = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonCall.message).toBe(jsonCall.message.trim());
  });

  it('handles multer LIMIT_FILE_SIZE error with code FILE_TOO_LARGE and MB unit in message', () => {
    const res = createMockRes();
    const multerError = new multer.MulterError('LIMIT_FILE_SIZE');

    errorHandler(multerError, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'FILE_TOO_LARGE',
      message: 'File size must not exceed 5 MB',
    });
  });

  it('handles JWT errors with code UNAUTHORIZED', () => {
    const res = createMockRes();
    const jwtError = new JsonWebTokenError('jwt malformed');

    errorHandler(jwtError, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
    });
  });

  it('formats ValidationError with details.issues as single source of field errors', () => {
    const res = createMockRes();
    const schema = z.object({
      name: z.string().trim().min(1, 'Name is required'),
    });
    const parsed = schema.safeParse({ name: '' });
    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      const error = new ValidationError({ issues: parsed.error.issues, body: parsed.error.issues });
      errorHandler(error, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      const jsonCall = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(jsonCall.code).toBe('VALIDATION_ERROR');
      expect(jsonCall.details).toHaveProperty('issues');
      expect(jsonCall.details.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Name is required',
      });
    }
  });
});
