import { NextFunction, Response } from 'express';
// import { Role } from '@prisma/client';
import { Role } from '../enums/Role';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';

                               // can pass any number of role  [...]
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
