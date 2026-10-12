import type Redis from 'ioredis';
import { redis } from '../../../../../shared/infrastructure/redis/redis.client';
import { IOtpRepository } from '../../../domain/repositories/IOtpRepository';

export class RedisOtpRepository implements IOtpRepository {
  constructor(private readonly redisClient: Redis = redis) {}

  async saveOtp(
    email: string,
    otp: string,
    ttlSeconds: number,
  ): Promise<number> {
    return this.redisClient
      .setex(this.getKey(email), ttlSeconds, otp)
      .then(() => ttlSeconds);
  }

  async getOtp(email: string): Promise<string | null> {
    return this.redisClient.get(this.getKey(email));
  }

  async deleteOtp(email: string): Promise<void> {
    await this.redisClient.del(this.getKey(email));
  }

  private getKey(email: string): string {
    const cleanEmail = email.startsWith('otp:') ? email.slice(4) : email;
    return `otp:${cleanEmail}`;
  }
}
