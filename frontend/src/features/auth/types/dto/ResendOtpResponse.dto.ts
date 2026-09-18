export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    otpExpireAt: number;
  };
}