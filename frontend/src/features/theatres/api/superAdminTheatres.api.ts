import api from '@/shared/lib/axios';

export type AdminRole = 'PRIMARY_MANAGER' | 'OPERATIONS_SUPERVISOR' | 'BOX_OFFICE_LEAD';

export interface SuperAdminTheatreAdmin {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: AdminRole;
  isActive: boolean;
  assignedAt: string;
}

export interface SuperAdminTheatre {
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
  assignedAdmins: SuperAdminTheatreAdmin[];
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminAssignmentDetails {
  id: string;
  userId: string;
  theatreId: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface TheatreAdminStatsResponse {
  totalCinemas: number;
  assignedCinemas: number;
  unassignedCinemas: number;
  totalAdmins: number;
  activeAdmins: number;
  suspendedAdmins: number;
  cities?: string[];
}

export interface EligibleAdminUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const listTheatresForAdmin = async (query?: {
  search?: string;
  city?: string;
  status?: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
  limit?: number;
  page?: number;
}): Promise<SuperAdminTheatre[]> => {
  const response = await api.get<ApiResponse<SuperAdminTheatre[]>>('/theatres/for-admin', {
    params: query,
  });
  return response.data.data;
};

export const getTheatreAdminStats = async (): Promise<TheatreAdminStatsResponse> => {
  const response = await api.get<ApiResponse<TheatreAdminStatsResponse>>('/theatres/admin-stats');
  return response.data.data;
};

export const listEligibleTheatreAdmins = async (
  search?: string,
): Promise<EligibleAdminUserResponse[]> => {
  const response = await api.get<ApiResponse<EligibleAdminUserResponse[]>>(
    '/theatres/eligible-admins',
    { params: { search } },
  );
  return response.data.data;
};

export const listTheatreAdminAssignments = async (query?: {
  theatreId?: string;
  search?: string;
  role?: AdminRole;
  status?: 'ALL' | 'ACTIVE' | 'SUSPENDED';
}): Promise<SuperAdminAssignmentDetails[]> => {
  const response = await api.get<ApiResponse<SuperAdminAssignmentDetails[]>>(
    '/theatres/admin-assignments',
    { params: query },
  );
  return response.data.data;
};

export interface AssignTheatreAdminRequest {
  theatreId: string;
  role?: AdminRole;
  userId?: string;
  email?: string;
  name?: string;
  phone?: string;
}

export interface AssignTheatreAdminResponse {
  id: string;
  userId: string;
  theatreId: string;
  role: AdminRole;
  isActive: boolean;
  temporaryPassword?: string;
  isNewUser?: boolean;
  emailSent?: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  theatre?: {
    id: string;
    name: string;
  };
}

export const assignTheatreAdminApi = async (
  data: AssignTheatreAdminRequest,
): Promise<AssignTheatreAdminResponse> => {
  const response = await api.post<ApiResponse<AssignTheatreAdminResponse>>(
    '/theatres/admin-assignments',
    data,
  );
  return response.data.data;
};

export const updateTheatreAdminAssignmentApi = async (
  assignmentId: string,
  data: {
    isActive?: boolean;
    role?: AdminRole;
  },
): Promise<SuperAdminTheatreAdmin> => {
  const response = await api.patch<ApiResponse<SuperAdminTheatreAdmin>>(
    `/theatres/admin-assignments/${assignmentId}`,
    data,
  );
  return response.data.data;
};

export const revokeTheatreAdminAssignmentApi = async (
  assignmentId: string,
): Promise<void> => {
  await api.delete(`/theatres/admin-assignments/${assignmentId}`);
};
