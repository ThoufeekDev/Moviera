import api from '@/shared/lib/axios';
import type { ApiResponse, Paginated } from '@/shared/types/apiResponse';

export interface SuperAdminFacilityItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconKey: string | null;
  isActive: boolean;
  assignedTheatreCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveFacilityOption {
  id: string;
  name: string;
  slug: string;
  iconKey: string | null;
}

export interface GetFacilitiesParams {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
}

export type GetFacilitiesResponseData = Paginated<SuperAdminFacilityItem>;
export type FacilityApiResponse<T> = ApiResponse<T>;

export interface CreateFacilityPayload {
  name: string;
  description?: string | null;
  iconKey?: string | null;
}

export interface EditFacilityPayload {
  name: string;
  description?: string | null;
  iconKey?: string | null;
}

export const getFacilities = async (
  params: GetFacilitiesParams = {},
  signal?: AbortSignal,
): Promise<GetFacilitiesResponseData> => {
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

  const response = await api.get<FacilityApiResponse<GetFacilitiesResponseData>>(
    '/theatres/facilities',
    {
      params: queryParams,
      signal,
    },
  );

  return response.data.data;
};

export const getActiveFacilities = async (
  signal?: AbortSignal,
): Promise<ActiveFacilityOption[]> => {
  const response = await api.get<FacilityApiResponse<ActiveFacilityOption[]>>(
    '/theatres/facilities/active',
    { signal },
  );

  return response.data.data;
};

export const createFacility = async (
  payload: CreateFacilityPayload,
): Promise<SuperAdminFacilityItem> => {
  const response = await api.post<FacilityApiResponse<SuperAdminFacilityItem>>(
    '/theatres/facilities',
    payload,
  );

  return response.data.data;
};

export const editFacility = async (
  id: string,
  payload: EditFacilityPayload,
): Promise<SuperAdminFacilityItem> => {
  const response = await api.put<FacilityApiResponse<SuperAdminFacilityItem>>(
    `/theatres/facilities/${id}`,
    payload,
  );

  return response.data.data;
};

export const toggleFacilityStatus = async (
  id: string,
  isActive: boolean,
): Promise<SuperAdminFacilityItem> => {
  const response = await api.patch<FacilityApiResponse<SuperAdminFacilityItem>>(
    `/theatres/facilities/${id}/status`,
    { isActive },
  );

  return response.data.data;
};
