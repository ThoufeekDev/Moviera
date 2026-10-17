import type { City } from './city.types';

export interface Area {
  id: string;
  name: string;
  cityId?: string;
}

export interface Theatre {
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
  pincode?: string | null;
  landmark?: string | null;
  isActive: boolean;
  licenseNumber: string | null;
  city: City;
  area?: Area | null;
  createdAt: string;
  updatedAt: string;
}