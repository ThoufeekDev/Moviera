import { Resend } from "resend";
import { env } from "../../../config/env";
import { IEmailService } from "../../domain/services/IEmailService";

export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendOtpEmail(
    email: string,
    otp: string,
  ): Promise<void> {
    try {
      const response = await this.resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",
        html: `
          <h1>Your OTP</h1>
          <p>${otp}</p>
        `,
      });

      console.log("RESEND RESPONSE:", response);

      if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      console.error("EMAIL ERROR:", error);
      throw error;
    }
  }
}