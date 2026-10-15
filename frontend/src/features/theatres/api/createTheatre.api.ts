import api from '@/shared/lib/axios';

export interface CreateTheatrePayload {
  cityId: string;
  name: string;
  address: string;
  description?: string;
  email?: string;
  phone?: string;
  pincode?: string;
  landmark?: string;
  licenseNumber?: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
  logo?: File | null;
}

export interface CreatedTheatreResponseData {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  address: string;
  description: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  pincode: string | null;
  landmark: string | null;
  isActive: boolean;
  licenseNumber: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTheatreApiResponse {
  success: boolean;
  message: string;
  data: CreatedTheatreResponseData;
}

export const createTheatreApi = async (
  payload: CreateTheatrePayload,
): Promise<CreateTheatreApiResponse> => {
  const formData = new FormData();
  formData.append('cityId', payload.cityId);
  formData.append('name', payload.name);
  formData.append('address', payload.address);

  if (payload.description) {
    formData.append('description', payload.description);
  }
  if (payload.email) {
    formData.append('email', payload.email);
  }
  if (payload.phone) {
    formData.append('phone', payload.phone);
  }
  if (payload.pincode) {
    formData.append('pincode', payload.pincode);
  }
  if (payload.landmark) {
    formData.append('landmark', payload.landmark);
  }
  if (payload.licenseNumber) {
    formData.append('licenseNumber', payload.licenseNumber);
  }
  if (payload.latitude !== undefined && payload.latitude !== null) {
    formData.append('latitude', String(payload.latitude));
  }
  if (payload.longitude !== undefined && payload.longitude !== null) {
    formData.append('longitude', String(payload.longitude));
  }
  if (payload.isActive !== undefined) {
    formData.append('isActive', String(payload.isActive));
  }
  if (payload.logo) {
    formData.append('logo', payload.logo);
  }

  const response = await api.post<CreateTheatreApiResponse>('/theatres', formData);
  return response.data;
};
