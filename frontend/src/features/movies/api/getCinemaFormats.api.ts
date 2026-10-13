import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { CinemaFormat } from '../types/referenceData.types';

export type { CinemaFormat };

export const getCinemaFormats = async (): Promise<CinemaFormat[]> => {
  const response = await api.get<ApiResponse<CinemaFormat[]>>('/cinema-format');
  return response.data.data;
};