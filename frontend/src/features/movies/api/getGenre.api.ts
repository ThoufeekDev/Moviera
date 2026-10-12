import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { Genre } from '../types/referenceData.types';

export type { Genre };

export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get<ApiResponse<Genre[]>>('/genre');
  return response.data.data;
};