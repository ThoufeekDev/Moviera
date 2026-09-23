export interface IOtpNotificationService {
  sendOtp(email: string, otp: string): Promise<void>;
}
