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
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const details: {
      body?: z.ZodIssue[];
      params?: z.ZodIssue[];
      query?: z.ZodIssue[];
      issues?: z.ZodIssue[];
    } = {};
    const allIssues: z.ZodIssue[] = [];
    const validated: ValidatedRequest["validated"] = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        details.body = result.error.issues;
        allIssues.push(...result.error.issues);
      } else {
        validated.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);

      if (!result.success) {
        details.params = result.error.issues;
        allIssues.push(...result.error.issues);
      } else {
        validated.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        details.query = result.error.issues;
        allIssues.push(...result.error.issues);
      } else {
        validated.query = result.data;
      }
    }

    if (allIssues.length > 0) {
      details.issues = allIssues;
      const firstMessage = allIssues[0]?.message;
      return next(new ValidationError(details, firstMessage));
    }

    req.validated = validated;
    res.locals.validated = validated;
    next();
  };
};