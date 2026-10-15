import type { PaginatedResult } from '../../../../shared/types/Pagination';
import type { SuperAdminTheatreListItem } from '../read-models/SuperAdminTheatreListItem';
import type { SuperAdminListTheatresItems } from '../read-models/SuperAdminListTheatresItems';
import type { TheatreOverview } from '../read-models/TheatreOverview';
import type { TheatreWithCity } from '../read-models/TheatreWithCity';
import type { status } from '../../domain/enums/status';

import type { CityOption } from '../read-models/CityOption';

export interface ITheatreQueryService {
  findByAdminId(adminId: string): Promise<TheatreWithCity[]>;
  getOverview(theatreId: string, adminId: string): Promise<TheatreOverview | null>;
  listForSuperAdmin(filter?: {
    search?: string;
    city?: string;
    status?: status;
    limit?: number;
    page?: number;
  }): Promise<SuperAdminTheatreListItem[]>;

  ListAllTheatres(filter?: {
    search?: string;
    status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
    limit?: number;
    page?: number;
  }): Promise<PaginatedResult<SuperAdminListTheatresItems>>;

  listCities(): Promise<CityOption[]>;
}

