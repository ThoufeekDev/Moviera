import type { Response, NextFunction } from 'express';

import { Controller } from './HttpTypes';
import type { AuthenticatedRequest } from '../types/AuthenticateRequest';
import type { ValidatedRequest } from '../middleware/validate';

export const adapt =
  <P = unknown, B = unknown, Q = unknown, R = unknown>(controller: Controller<P, B, Q, R>) =>
  async (req: AuthenticatedRequest & ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await controller({
        params: (req.validated?.params ?? req.params) as P,
        body: (req.validated?.body ?? req.body) as B,
        query: (req.validated?.query ?? req.query) as Q,
        user:
          req.userId && req.role
            ? {
                userId: req.userId,
                role: req.role,
              }
            : undefined,
        files: req.files as Record<string, { buffer: Buffer }[]> | undefined,
      });

      return res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  };
