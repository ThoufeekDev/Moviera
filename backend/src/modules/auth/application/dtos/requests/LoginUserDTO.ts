// import { Role } from "@prisma/client"
import { Role } from '../../../../../shared/enums/Role';
export interface LoginUserDTO {
  email: string;
  password: string;
  role: Role;
}
