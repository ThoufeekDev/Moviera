import api from '@/shared/lib/axios';

export interface SuperAdminManageTheatreItem {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  address: string;
  licenseNumber: string | null;
  isActive: boolean;
  totalScreens: number;
  city: {
    id: string;
    name: string;
    state?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetAllTheatresParams {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
}

export interface GetAllTheatresResponseData {
  items: SuperAdminManageTheatreItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetAllTheatresResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  data: GetAllTheatresResponseData;
}

export const getAllTheatres = async (
  params: GetAllTheatresParams = {},
  signal?: AbortSignal,
): Promise<GetAllTheatresResponseData> => {
  const queryParams: Record<string, unknown> = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };

  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  if (params.status && params.status !== 'ALL') {
    queryParams.status = params.status;
  }

  const response = await api.get<GetAllTheatresResponse>('/theatres', {
    params: queryParams,
    signal,
  });

  return response.data.data;
};
