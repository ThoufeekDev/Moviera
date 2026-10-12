import type { Response, NextFunction } from 'express';

import { Controller } from './HttpTypes';
import type { AuthenticatedRequest } from '../types/AuthenticateRequest';
import type { ValidatedRequest } from '../middleware/validate';

export const adapt =
  <P = unknown, B = unknown, Q = unknown, R = unknown>(controller: Controller<P, B, Q, R>) =>
  async (req: AuthenticatedRequest & ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = res.locals?.validated ?? req.validated;
      const result = await controller({
        params: (validated?.params ?? req.params) as P,
        body: (validated?.body ?? req.body) as B,
        query: (validated?.query ?? req.query) as Q,
        cookies: req.cookies as Record<string, string> | undefined,
        user:
          req.userId && req.role
            ? {
                userId: req.userId,
                role: req.role,
              }
            : undefined,
        files: req.files as Record<string, { buffer: Buffer }[]> | undefined,
        file: req.file ? { buffer: req.file.buffer } : undefined,
      });

      if (result.cookies) {
        for (const cookie of result.cookies) {
          if (cookie.options) {
            res.cookie(cookie.name, cookie.value, cookie.options);
          } else {
            res.cookie(cookie.name, cookie.value);
          }
        }
      }

      if (result.clearCookies) {
        for (const cookie of result.clearCookies) {
          if (cookie.options) {
            res.clearCookie(cookie.name, cookie.options);
          } else {
            res.clearCookie(cookie.name);
          }
        }
      }

      return res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  };
