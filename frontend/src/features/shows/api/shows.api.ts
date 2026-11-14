import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  CreateShowPayload,
  GetShowsParams,
  GetShowsResponseData,
  ShowDetail,
  ShowResult,
  UpdateShowPayload,
} from '../types/show.types';

export const getShows = async (
  params: GetShowsParams = {},
  signal?: AbortSignal,
): Promise<GetShowsResponseData> => {
  const queryParams: Record<string, unknown> = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };

  const search = params.search?.trim();
  if (search) queryParams.search = search;
  if (params.status && params.status !== 'ALL') queryParams.status = params.status;
  if (params.theatreId) queryParams.theatreId = params.theatreId;
  if (params.screenId) queryParams.screenId = params.screenId;
  if (params.movieId) queryParams.movieId = params.movieId;
  if (params.cinemaFormatId) queryParams.cinemaFormatId = params.cinemaFormatId;
  if (params.date) queryParams.date = params.date;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;

  const response = await api.get<ApiResponse<GetShowsResponseData>>('/shows', {
    params: queryParams,
    signal,
  });

  return response.data.data;
};

export const getShowById = async (
  showId: string,
  signal?: AbortSignal,
): Promise<ShowDetail> => {
  const response = await api.get<ApiResponse<ShowDetail>>(`/shows/${showId}`, {
    signal,
  });

  return response.data.data;
};

export const createShow = async (payload: CreateShowPayload): Promise<ShowResult> => {
  const response = await api.post<ApiResponse<ShowResult>>('/shows', payload);
  return response.data.data;
};

export const publishShow = async (showId: string): Promise<ShowResult> => {
  const response = await api.patch<ApiResponse<ShowResult>>(`/shows/${showId}/publish`);
  return response.data.data;
};

export const cancelShow = async (showId: string): Promise<ShowResult> => {
  const response = await api.patch<ApiResponse<ShowResult>>(`/shows/${showId}/cancel`);
  return response.data.data;
};

export const updateShow = async (
  showId: string,
  payload: UpdateShowPayload,
): Promise<ShowResult> => {
  const response = await api.patch<ApiResponse<ShowResult>>(`/shows/${showId}`, payload);
  return response.data.data;
};

