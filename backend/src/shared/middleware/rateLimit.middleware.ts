import { Request, Response, NextFunction } from 'express';
import { redis } from '../infrastructure/redis/redis.client';
import { TooManyRequestsError } from '../errors/TooManyRequestsError';

export const otpRateLimit = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const email = req.body?.email;

    if (!email) {
      return next();
    }

    const key = `otp-rate-limit:${email}`;

    const attempts = await redis.incr(key);

    // key expire in redis after 10min
    if (attempts === 1) {
      await redis.expire(key, 600);
    }

    if (attempts > 5) {
      throw new TooManyRequestsError('Too many OTP requests. Try again later.');
    }

    next();
  } catch (error) {
    next(error);
  }
};
