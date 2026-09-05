import { Role } from '../../../../../shared/enums/Role';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
  turnstileToken: string;
}
