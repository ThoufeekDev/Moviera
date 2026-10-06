import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema:z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {

      return next(result.error)
      // return res.status(400).json({
      //   message: 'Validation failed',
      //   errors: result.error.flatten(),
      // });
    }

    req.body = result.data;

    next();
  };
};
