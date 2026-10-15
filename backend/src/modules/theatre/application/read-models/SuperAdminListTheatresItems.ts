export interface SuperAdminListTheatresItems {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  address: string;
  licenseNumber: string | null;
  isActive: boolean;
  totalScreens: number;
  city: {
    id: string;
    name: string;
    state?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}