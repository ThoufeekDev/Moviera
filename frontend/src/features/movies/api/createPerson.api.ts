import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { Person } from '../types/person.types';

export interface CreatePersonData {
  name: string;
  image?: File;
}

export type createPersonData = CreatePersonData;
export type { Person };

export const createPerson = async (data: CreatePersonData): Promise<Person> => {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.image) formData.append('image', data.image);

  const response = await api.post<ApiResponse<Person>>('/persons', formData);
  return response.data.data;
};