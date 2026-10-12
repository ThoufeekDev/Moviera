
import type { Role } from '../../../../shared/enums/Role';

export interface TheatreAdminUser {
  id: string;
  role: Role;
  isActive: boolean;
}

export interface ITheatreAdminUserReader {
  findById(userId: string): Promise<TheatreAdminUser | null>;
}
