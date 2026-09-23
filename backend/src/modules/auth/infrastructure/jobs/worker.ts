import { Worker } from "bullmq";
import {redis} from "../../../../shared/infrastructure/redis/redis.client"
import { ResendEmailService } from "../../../../shared/infrastructure/email/ResendEmailService";
const emailService = new ResendEmailService();

export const otpWorker = new Worker(
  "otp-email-queue",

  async (job) => {
    await emailService.sendOtpEmail(
      job.data.email,
      job.data.otp,
    );

    console.log(
      "OTP email sent " + job.data.otp,
    );
  },

  {
    connection: redis,
  },
);

// Job completed
otpWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

// Job failed
otpWorker.on("failed", (job, err) => {
  console.error(
    `Job ${job?.id} failed`,
    err,
  );
});