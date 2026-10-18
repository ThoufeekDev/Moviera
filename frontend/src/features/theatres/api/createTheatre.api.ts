import api from '@/shared/lib/axios';

export interface CreateTheatrePayload {
  cityId?: string | null;
  areaId?: string | null;
  cityName?: string | null;
  areaName?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  googlePlaceId?: string | null;

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
  facilityIds?: string[];
  logo?: File | null;
}

export interface CreatedTheatreResponseData {
  id: string;
  cityId: string;
  areaId?: string | null;
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
  googlePlaceId?: string | null;
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

  if (payload.cityId && payload.cityId.trim() !== '') {
    formData.append('cityId', payload.cityId.trim());
  }
  if (payload.areaId && payload.areaId.trim() !== '') {
    formData.append('areaId', payload.areaId.trim());
  }
  if (payload.cityName && payload.cityName.trim() !== '') {
    formData.append('cityName', payload.cityName.trim());
  }
  if (payload.areaName && payload.areaName.trim() !== '') {
    formData.append('areaName', payload.areaName.trim());
  }
  if (payload.district && payload.district.trim() !== '') {
    formData.append('district', payload.district.trim());
  }
  if (payload.state && payload.state.trim() !== '') {
    formData.append('state', payload.state.trim());
  }
  if (payload.country && payload.country.trim() !== '') {
    formData.append('country', payload.country.trim());
  }
  if (payload.googlePlaceId && payload.googlePlaceId.trim() !== '') {
    formData.append('googlePlaceId', payload.googlePlaceId.trim());
  }

  formData.append('name', payload.name.trim());
  formData.append('address', payload.address.trim());

  if (payload.description?.trim()) {
    formData.append('description', payload.description.trim());
  }
  if (payload.email?.trim()) {
    formData.append('email', payload.email.trim());
  }
  if (payload.phone?.trim()) {
    formData.append('phone', payload.phone.trim());
  }
  if (payload.pincode?.trim()) {
    formData.append('pincode', payload.pincode.trim());
  }
  if (payload.landmark?.trim()) {
    formData.append('landmark', payload.landmark.trim());
  }
  if (payload.licenseNumber?.trim()) {
    formData.append('licenseNumber', payload.licenseNumber.trim());
  }

  // Send coordinates only when both latitude and longitude are available
  const hasLat =
    payload.latitude !== undefined && payload.latitude !== null && !Number.isNaN(payload.latitude);
  const hasLng =
    payload.longitude !== undefined && payload.longitude !== null && !Number.isNaN(payload.longitude);
  if (hasLat && hasLng) {
    formData.append('latitude', String(payload.latitude));
    formData.append('longitude', String(payload.longitude));
  }

  if (payload.isActive !== undefined) {
    formData.append('isActive', String(payload.isActive));
  }
  if (payload.facilityIds && payload.facilityIds.length > 0) {
    for (const facilityId of payload.facilityIds) {
      formData.append('facilityIds', facilityId);
    }
  }
  if (payload.logo) {
    formData.append('logo', payload.logo);
  }

  const response = await api.post<CreateTheatreApiResponse>('/theatres', formData);
  return response.data;
};
