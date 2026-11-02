import api from '@/shared/lib/axios';
import type { SuperAdminTheatreDetail } from '../types/superAdminTheatreDetail.types';

export interface GetSuperAdminTheatreDetailResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  data: SuperAdminTheatreDetail;
}

export const getSuperAdminTheatreDetail = async (
  theatreId: string,
  signal?: AbortSignal,
): Promise<SuperAdminTheatreDetail> => {
  const response = await api.get<GetSuperAdminTheatreDetailResponse>(
    `/theatres/${theatreId}/details`,
    { signal },
  );

  return response.data.data;
};
