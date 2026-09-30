export interface TheatreProps {
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
  createdAt: Date;
  updatedAt: Date;
}