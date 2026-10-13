import type { Role } from '../../../../shared/enums/Role';

export interface TheatreAdminUser {
  id: string;
  role: Role;
  isActive: boolean;
}

export interface EligibleAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  isActive: boolean;
}

export interface ITheatreAdminUserReader {
  findById(userId: string): Promise<TheatreAdminUser | null>;
  findEligibleAdmins(search?: string): Promise<EligibleAdminUser[]>;
}
