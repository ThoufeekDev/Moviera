import { otpQueue } from "../jobs/queue";
import { IOtpNotificationService } from "../../domain/services/IOtpNotificationService";



export class BullMQOtpNotificationService implements IOtpNotificationService {
  async sendOtp(email: string, otp: string): Promise<void> {
      await otpQueue.add(
          "send-otp-email",
          {
              email,
              otp,
          },
          {
              attempts: 3,
              backoff: {
                  type: "exponential",
                  delay:3000,
              },
              removeOnComplete: 1000,
              removeOnFail:1000,
          }
        )
  }
}