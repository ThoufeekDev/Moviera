import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { Language } from '../types/referenceData.types';

export type { Language };

export const getLanguages = async (): Promise<Language[]> => {
  const response = await api.get<ApiResponse<Language[]>>('/language');
  return response.data.data;
};