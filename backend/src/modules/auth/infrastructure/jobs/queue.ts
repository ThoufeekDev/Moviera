import { Queue } from "bullmq";
import {redis} from "../../../../shared/infrastructure/redis/redis.client"

export const otpQueue = new Queue("otp-email-queue", {
  connection: redis,
});