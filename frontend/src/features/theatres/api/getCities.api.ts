import api from '@/shared/lib/axios';

export interface CityOption {
  id: string;
  name: string;
  state: string;
}

export interface GetCitiesResponse {
  success: boolean;
  message?: string;
  data: CityOption[];
}

export const getCities = async (signal?: AbortSignal): Promise<CityOption[]> => {
  const response = await api.get<GetCitiesResponse>('/theatres/cities', { signal });
  return response.data.data;
};
