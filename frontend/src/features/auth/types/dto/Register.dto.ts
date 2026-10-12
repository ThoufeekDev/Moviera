import type { Role } from '@/shared/constants/Role';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: Role | 'USER';
  confirmPassword?: string;
  turnstileToken: string;
}
