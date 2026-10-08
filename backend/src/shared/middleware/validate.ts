import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../errors/ValidationError";

interface ValidationSchemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

export interface ValidatedRequest extends Request {
  validated?: {
    body?: unknown;
    params?: unknown;
    query?: unknown;
  };
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: ValidatedRequest, _res: Response, next: NextFunction) => {
    const errors: Record<string, z.ZodError> = {};
    const validated: ValidatedRequest["validated"] = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        errors.body = result.error;
      } else {
        validated.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);

      if (!result.success) {
        errors.params = result.error;
      } else {
        validated.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        errors.query = result.error;
      } else {
        validated.query = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      return next(new ValidationError(errors))
    }

    req.validated = validated;
    next();
  };
};