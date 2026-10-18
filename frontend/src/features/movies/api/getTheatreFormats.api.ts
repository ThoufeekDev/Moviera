import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { TheatreFormat } from '../types/referenceData.types';

export type { TheatreFormat };

export const getTheatreFormats = async (): Promise<TheatreFormat[]> => {
  const response = await api.get<ApiResponse<TheatreFormat[]>>('/theatre-format');
  return response.data.data;
};