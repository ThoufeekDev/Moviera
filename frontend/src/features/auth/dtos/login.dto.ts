import type { Role } from "../../../shared/enums/Role";

export interface LoginDTO {
  email: string;
  password: string;
  role: Role
}
