export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  confirmPassword: string;
  turnstileToken: string;
}
