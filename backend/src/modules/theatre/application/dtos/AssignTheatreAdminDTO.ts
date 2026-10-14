import type { TheatreAdminAssignmentRole } from "../../domain/enums/TheatreAdminAssignmentRole";

export interface AssignTheatreAdminDTO {
  theatreId: string;
  role?: TheatreAdminAssignmentRole;
  userId?: string;
  email?: string;
  name?: string;
  phone?: string;
}

export interface AssignTheatreAdminResult {
  id: string;
  userId: string;
  theatreId: string;
  role: string;
  isActive: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  theatre: {
    id: string;
    name: string;
  };
  temporaryPassword?: string;
  isNewUser: boolean;
  emailSent: boolean;
}

