import type { SuperAdminTheatreListItem } from '../read-models/SuperAdminTheatreListItem';
import type { TheatreOverview } from '../read-models/TheatreOverview';
import type { TheatreWithCity } from '../read-models/TheatreWithCity';
import type { status } from '../../domain/enums/status';
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
}
