import { NextFunction, Response } from 'express';
import { env } from '../../config/env';
import { verifyToken } from '../utils/verifyToken';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';
import { Role } from '@prisma/client';

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const decoded = verifyToken(token, env.JWT_SECRET!);

    req.userId = decoded.userId as string;
    req.role = decoded.role as Role;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }
};
