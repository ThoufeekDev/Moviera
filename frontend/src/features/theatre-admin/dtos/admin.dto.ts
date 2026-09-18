export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN';
  confirmPassword: string;
  turnstileToken: string;
}
