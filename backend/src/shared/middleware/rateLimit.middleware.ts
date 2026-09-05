import { Request, Response, NextFunction } from 'express';
import { redis } from '../redis_config/redis';

export const otpRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;

  const key = `otp-rate-limit:${email}`;

  const attempts = await redis.incr(key);

  // key expire in redis after 10min
  if (attempts === 1) {
    await redis.expire(key, 600);
  }

  if (attempts > 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many OTP requests. Try again later. ',
    });
  }

  next();
};
