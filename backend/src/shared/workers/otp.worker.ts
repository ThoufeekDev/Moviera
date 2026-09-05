import { Worker } from 'bullmq';

import { redis } from '../redis_config/redis';
import { sendOtpEmail } from '../services/email.service';

export const otpWorker = new Worker(
  'otp-email-queue',

  async (job) => {
    await sendOtpEmail(job.data.email, job.data.otp);

    console.log('OTP email sent ' + job.data.otp);
  },

  {
    connection: redis,
  },
);

// added even listeners for logging and error handling

otpWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

otpWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});
