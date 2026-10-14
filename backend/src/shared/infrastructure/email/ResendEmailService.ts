import { Resend } from "resend";
import { env } from "../../../config/env";
import { IEmailService, TheatreAdminCredentialsEmailData } from "../../domain/services/IEmailService";

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

  async sendTheatreAdminCredentialsEmail(
    data: TheatreAdminCredentialsEmailData,
  ): Promise<void> {
    try {
      if (!env.RESEND_API_KEY) {
        console.warn(
          `[EmailService] RESEND_API_KEY not set. Mock credentials email to ${data.email}: tempPassword=${data.temporaryPassword}`,
        );
        return;
      }

      const roleLabels: Record<string, string> = {
        PRIMARY_MANAGER: 'Primary General Manager',
        OPERATIONS_SUPERVISOR: 'Operations Supervisor',
        BOX_OFFICE_LEAD: 'Box Office Lead',
      };
      const displayRole = roleLabels[data.role] || data.role;

      const passwordSection = data.temporaryPassword
        ? `
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Temporary Login Password</p>
            <div style="font-family: monospace; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 1px; background: #ffffff; padding: 10px 14px; border-radius: 6px; border: 1px dashed #cbd5e1; display: inline-block;">
              ${data.temporaryPassword}
            </div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
              ⚠️ Please change your password upon your first successful login.
            </p>
          </div>
        `
        : `
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #334155;">
              Use your existing Moviera account credentials to log in.
            </p>
          </div>
        `;

      const response = await this.resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.email,
        subject: `Welcome to Moviera - Cinema Partner Access for ${data.theatreName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Moviera Cinema Access</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
            <div style="max-width: 600px; margin: 32px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <!-- Header -->
              <div style="background-color: #09090b; padding: 28px 32px; text-align: left; border-bottom: 2px solid #e11d48;">
                <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">MOVIERA</span>
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #e11d48; font-weight: 600; margin-top: 4px;">Cinema Partner Portal</span>
              </div>

              <!-- Body -->
              <div style="padding: 32px;">
                <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">
                  Hello ${data.name},
                </h1>
                <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                  You have been authorized by the Super Administrator to manage <strong>${data.theatreName}</strong> on the Moviera Cinema Management Platform.
                </p>

                <!-- Details Card -->
                <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 18px 22px; margin-bottom: 24px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 140px;">Cinema Multiplex:</td>
                      <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.theatreName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Assigned Role:</td>
                      <td style="padding: 6px 0; font-size: 14px; color: #e11d48; font-weight: 600;">${displayRole}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Login Email:</td>
                      <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.email}</td>
                    </tr>
                  </table>
                </div>

                ${passwordSection}

                <!-- Action Button -->
                <div style="text-align: center; margin: 32px 0 24px 0;">
                  <a href="${data.loginUrl}" style="background-color: #e11d48; color: #ffffff; padding: 13px 32px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 2px 4px rgba(225, 29, 72, 0.2);">
                    Log In to Cinema Portal
                  </a>
                </div>

                <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; text-align: center; margin-bottom: 0;">
                  Or access directly at: <a href="${data.loginUrl}" style="color: #64748b;">${data.loginUrl}</a>
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Moviera Entertainment Inc. All rights reserved.
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("[EmailService] Resend credentials email response:", response);

      if (response.error) {
        console.error("[EmailService] Resend error:", response.error.message);
        throw new Error(response.error.message);
      }
    } catch (error) {
      console.error("[EmailService] Failed to send credentials email:", error);
      throw error;
    }
  }
}