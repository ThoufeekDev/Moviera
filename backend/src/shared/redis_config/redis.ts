import Redis from 'ioredis';
import { env } from '../../config/env';
export const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('Redis Connection Error:', err);
});

