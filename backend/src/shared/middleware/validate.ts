import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidationSchemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: Record<string, z.ZodError> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        errors.body = result.error;
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);

      if (!result.success) {
        errors.params = result.error;
      } else {
        req.params = result.data as typeof req.params
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        errors.query = result.error;
      } else {
        req.query = result.data as typeof req.query
      }
    }

    if (Object.keys(errors).length > 0) {
      return next(errors);
    }

    next();
  };
};