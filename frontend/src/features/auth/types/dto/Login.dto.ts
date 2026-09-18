
import type { Role } from "../../../../shared/constants/Role";
export interface LoginDTO {
  email: string;
  password: string;
  role: Role
}
