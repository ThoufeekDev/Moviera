export interface SuperAdminTheatreCity {
  id: string;
  name: string;
  district: string | null;
  state: string;
  country: string;
}

export interface SuperAdminTheatreArea {
  id: string;
  name: string;
}

export interface SuperAdminTheatreStatistics {
  totalScreens: number;
  totalSeats: number;
  todayShows: number;
  todayBookings: number;
}

export interface SuperAdminTheatreScreenFormat {
  id: string;
  name: string;
}

export interface SuperAdminTheatreScreen {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  cinemaFormats: SuperAdminTheatreScreenFormat[];
  seatingCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminTheatreFacility {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  iconKey: string | null;
}

export interface SuperAdminTheatreAssignedAdmin {
  assignmentId: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  assignedAt: string;
}

export type SuperAdminTheatreActivityType =
  | 'THEATRE_CREATED'
  | 'THEATRE_UPDATED'
  | 'STATUS_CHANGED'
  | 'SCREEN_CREATED'
  | 'SCREEN_UPDATED'
  | 'ADMIN_ASSIGNED';

export interface SuperAdminTheatreActivityItem {
  id: string;
  type: SuperAdminTheatreActivityType;
  title: string;
  description: string;
  performedBy?: string;
  timestamp: string;
}

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

  city: SuperAdminTheatreCity;
  area: SuperAdminTheatreArea | null;

  statistics: SuperAdminTheatreStatistics;
  screens: SuperAdminTheatreScreen[];
  facilities: SuperAdminTheatreFacility[];
  assignedAdmins: SuperAdminTheatreAssignedAdmin[];
  activityHistory: SuperAdminTheatreActivityItem[];
}
