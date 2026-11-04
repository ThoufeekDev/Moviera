import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  CreateScreenPayload,
  GetScreensParams,
  GetScreensResponseData,
  Screen,
} from '../types/screen.types';

export const getScreens = async (
  theatreId: string,
  params: GetScreensParams = {},
  signal?: AbortSignal,
): Promise<GetScreensResponseData> => {
  const queryParams: Record<string, unknown> = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };

  const search = params.search?.trim();
  if (search) {
    queryParams.search = search;
  }

  if (params.status && params.status !== 'ALL') {
    queryParams.status = params.status;
  }

  const response = await api.get<ApiResponse<GetScreensResponseData>>(
    `/theatres/${theatreId}/screens`,
    { params: queryParams, signal },
  );

  return response.data.data;
};

export const createScreen = async (payload: CreateScreenPayload): Promise<Screen> => {
  const response = await api.post<ApiResponse<Screen>>('/theatres/screens', payload);

  return response.data.data;
};
