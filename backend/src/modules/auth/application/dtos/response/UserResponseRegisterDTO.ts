import { Role } from '../../../../../shared/enums/Role';
export interface UserResponserRegisterDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  otpExpireIn: number;
}
