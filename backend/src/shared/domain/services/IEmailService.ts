export interface TheatreAdminCredentialsEmailData {
  email: string;
  name: string;
  theatreName: string;
  role: string;
  loginUrl: string;
  temporaryPassword?: string;
  isNewUser: boolean;
}

export interface IEmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
  sendTheatreAdminCredentialsEmail(data: TheatreAdminCredentialsEmailData): Promise<void>;
}