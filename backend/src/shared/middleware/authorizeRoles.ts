import { NextFunction, Response } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';
import { success } from 'zod';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: 'Unathorized',
      });
    }
    // it checks allowedRoles["ADMIN","USER","SUPERADMIN"]
    // roles.includes("ADMIN")
    const isAllowed = allowedRoles.includes(req.role as Role);

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }
    next();
  };
};
