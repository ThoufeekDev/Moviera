import type { TheatreAdminAssignmentRole } from '../enums/TheatreAdminAssignmentRole';

export interface TheatreAdminAssignmentRecord {
  id: string;
  userId: string;
  theatreId: string;
  isActive: boolean;
  role: TheatreAdminAssignmentRole;
}

export interface TheatreAdminAssignmentListItem {
  id: string;
  userId: string;
  theatreId: string;
  isActive: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface TheatreAdminAssignmentDetails {
  id: string;
  userId: string;
  theatreId: string;
  role: TheatreAdminAssignmentRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    avatar: string | null;
  };
  theatre: {
    id: string;
    name: string;
    slug: string;
    city: {
      id: string;
      name: string;
    };
  };
}

export interface TheatreAdminStats {
  totalTheatres: number;
  assignedTheatres: number;
  unassignedTheatres: number;
  totalAdmins: number;
  activeAdmins: number;
  suspendedAdmins: number;
  cities?: string[];
}

export interface ITheatreAdminAssignmentRepository {
  findByUserAndTheatre(
    userId: string,
    theatreId: string,
  ): Promise<TheatreAdminAssignmentRecord | null>;

  findById(id: string): Promise<TheatreAdminAssignmentRecord | null>;

  create(
    userId: string,
    theatreId: string,
    role: TheatreAdminAssignmentRole,
  ): Promise<TheatreAdminAssignmentRecord>;

  updateActiveStatus(
    assignmentId: string,
    isActive: boolean,
  ): Promise<TheatreAdminAssignmentRecord>;

  updateAssignment(
    assignmentId: string,
    data: {
      isActive?: boolean;
      role?: TheatreAdminAssignmentRole;
    },
  ): Promise<TheatreAdminAssignmentRecord>;

  delete(assignmentId: string): Promise<void>;

  findActiveByTheatre(theatreId: string): Promise<TheatreAdminAssignmentRecord[]>;

  findAllByTheatre(theatreId: string): Promise<TheatreAdminAssignmentListItem[]>;

  findAll(filter?: {
    theatreId?: string;
    role?: TheatreAdminAssignmentRole;
    isActive?: boolean;
    search?: string;
  }): Promise<TheatreAdminAssignmentDetails[]>;

  findActivePrimaryManagerByTheatre(theatreId: string): Promise<TheatreAdminAssignmentRecord | null>;

  getStatistics(): Promise<TheatreAdminStats>;
}
