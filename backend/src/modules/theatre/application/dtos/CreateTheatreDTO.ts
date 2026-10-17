
export interface CreateTheatreDTO {
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
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  pincode?: string | null;
  landmark?: string | null;
  licenseNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
  createdById: string;
  logoFile?: {
    buffer: Buffer;
  };
}
