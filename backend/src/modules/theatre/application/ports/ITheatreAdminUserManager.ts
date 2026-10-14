export interface TheatreAdminUserSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
}

export interface ITheatreAdminUserManager {
  findByEmail(email: string): Promise<TheatreAdminUserSummary | null>;
  createTheatreAdmin(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
  }): Promise<TheatreAdminUserSummary>;
  promoteToTheatreAdmin(
    userId: string,
    data?: { passwordHash?: string; phone?: string; name?: string },
  ): Promise<TheatreAdminUserSummary>;
}
