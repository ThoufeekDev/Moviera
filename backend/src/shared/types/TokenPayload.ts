import { Role } from "../enums/Role";
export interface TokenPayload {
  userId: string;
  role: Role;
}
