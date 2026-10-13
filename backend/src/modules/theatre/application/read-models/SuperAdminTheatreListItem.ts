import { TheatreAdminAssignmentRole } from '../../domain/enums/TheatreAdminAssignmentRole';

export interface SuperAdminTheatreListItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: {
    id: string;
    name: string;
  };
  phone: string | null;
  email: string | null;
  licenseNumber: string | null;
  isActive: boolean;
  screensCount: number;
  totalSeats: number;
  assignedAdminsCount: number;
  assignedAdmins: {
    id: string;
    userId: string;
    name: string | null;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: TheatreAdminAssignmentRole;
    isActive: boolean;
    assignedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
