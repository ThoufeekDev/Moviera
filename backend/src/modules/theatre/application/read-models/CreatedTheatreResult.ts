export interface CreatedTheatreResult {
  id: string;
  cityId?: string | null;
  areaId?: string | null;
  googlePlaceId?: string | null;
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
  createdAt: Date;
  updatedAt: Date;
}
