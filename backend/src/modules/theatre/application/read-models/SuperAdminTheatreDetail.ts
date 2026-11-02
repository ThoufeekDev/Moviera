export interface SuperAdminTheatreDetail {
  id: string;
  name: string;
  slug: string;
  address: string;
  description: string | null;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  pincode: string | null;
  landmark: string | null;
  googlePlaceId: string | null;
  isActive: boolean;
  licenseNumber: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  createdByName: string | null;

  city: {
    id: string;
    name: string;
    district: string | null;
    state: string;
    country: string;
  };

  area: {
    id: string;
    name: string;
  } | null;

  statistics: {
    totalScreens: number;
    totalSeats: number;
    todayShows: number;
    todayBookings: number;
  };

  screens: Array<{
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    cinemaFormats: Array<{
      id: string;
      name: string;
    }>;
    seatingCapacity: number;
    createdAt: string;
    updatedAt: string;
  }>;

  facilities: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    iconKey: string | null;
  }>;

  assignedAdmins: Array<{
    assignmentId: string;
    userId: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    assignedAt: string;
  }>;

  activityHistory: Array<{
    id: string;
    type: 'THEATRE_CREATED' | 'THEATRE_UPDATED' | 'STATUS_CHANGED' | 'SCREEN_CREATED' | 'SCREEN_UPDATED' | 'ADMIN_ASSIGNED';
    title: string;
    description: string;
    performedBy?: string;
    timestamp: string;
  }>;
}
