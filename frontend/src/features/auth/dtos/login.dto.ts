export interface LoginDTO {
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}
