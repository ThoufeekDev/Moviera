import type { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../types/AuthenticateRequest';
import { Role } from '../enums/Role';

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.role !== Role.THEATRE_ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  next();
};
