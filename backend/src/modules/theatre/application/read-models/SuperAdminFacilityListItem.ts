export interface SuperAdminFacilityListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconKey: string | null;
  isActive: boolean;
  assignedTheatreCount: number;
  createdAt: Date;
  updatedAt: Date;
}
