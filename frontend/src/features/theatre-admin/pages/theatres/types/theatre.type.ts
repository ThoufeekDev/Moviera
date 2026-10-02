import type { City } from "./city.type";

export interface Theatre {
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
  isActive: boolean;
  licenseNumber: string | null;
  city: City;
  createdAt: string;
  updatedAt: string;
}