export interface TheatreProps {
  id: string;
  cityId: string;
  areaId: string | null;
  name: string;
  slug: string;
  address: string;
  description?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  email?: string | null;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId: string | null;
  pincode?: string | null;
  landmark?: string | null;
  isActive: boolean;
  licenseNumber?: string | null;
  createdById?: string | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}