import type { Request, Response, NextFunction } from "express";
import { env } from "../../config/env";
import { verifyToken } from "../utils/verifyToken";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import type { AuthenticatedRequest } from "../types/AuthenticateRequest";

export const authenticateUser = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new UnauthorizedError("Authentication required"));
  }

  const payload = verifyToken(token, env.JWT_SECRET);

  req.userId = payload.userId 
  req.role = payload.role 

  next();
};