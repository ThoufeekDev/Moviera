import { Queue } from 'bullmq';
import { redis } from '../redis_config/redis';

export const otpQueue = new Queue('otp-email-queue', {
  connection: redis,
});
