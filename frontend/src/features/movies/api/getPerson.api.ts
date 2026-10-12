import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { Person } from '../types/person.types';

export type { Person };

export const getPersons = async (): Promise<Person[]> => {
  const response = await api.get<ApiResponse<Person[]>>('/persons');
  return response.data.data;
};

export const getPerson = getPersons;