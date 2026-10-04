import { redis } from "../../../../shared/infrastructure/redis/redis.client";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";

export class RedisOtpRepository implements IOtpRepository {
  async saveOtp(
    email: string,
    otp: string,
    ttlSeconds: number,
  ): Promise<number> {
    return redis.setex(
      this.getKey(email),
      ttlSeconds,
      otp,
    ).then(() => ttlSeconds);
  }

  async getOtp(email: string): Promise<string | null> {
    return redis.get(this.getKey(email));
  }

  async deleteOtp(email: string): Promise<void> {
    await redis.del(this.getKey(email));
  }

  private getKey(email: string): string {
    return `otp:${email}`;
  }
}