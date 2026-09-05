import type { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../types/AuthenticateRequest';

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  next();
};
