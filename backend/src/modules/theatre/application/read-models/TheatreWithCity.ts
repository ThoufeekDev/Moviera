import type { Theatre } from '../../domain/entities/Theatre';

export interface CitySummary {
  id: string;
  name: string;
  state?: string | null;
  country?: string | null;
  isActive?: boolean;
}

export interface TheatreWithCity {
  theatre: Theatre;
  city: CitySummary;
}
