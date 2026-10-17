export interface FacilityResultDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconKey: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
