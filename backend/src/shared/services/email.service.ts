import { Resend } from 'resend';
import { env } from '../../config/env';
const resend = new Resend(env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',

      to: email,

      subject: 'Verify your email',

      html: `
          <h1>Your OTP</h1>
          <p>${otp}</p>
        `,
    });

    console.log('RESEND RESPONSE:', response);
        if (response.error) {
          throw new Error(response.error.message);
        }
  } catch (error) {
    console.error('EMAIL ERROR:', error);
    throw error
  }
};
