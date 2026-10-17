import { FacilityIconKey } from '../constants/FacilityIconKey';

export interface FacilityProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  iconKey?: FacilityIconKey | string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
