import { NextFunction, Response } from "express";
import { Role } from "../enums/Role";
import { AuthenticatedRequest } from "../types/AuthenticateRequest";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { ForbiddenError } from "../errors/ForbiddenError";

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.role) {
      return next(new UnauthorizedError("Authentication required"));
    }

    const isAllowed = allowedRoles.includes(req.role);

    if (!isAllowed) {
      return next(new ForbiddenError("Forbidden"));
    }

    next();
  };
};