import type { TheatreOverview } from '../read-models/TheatreOverview';
import type { TheatreWithCity } from '../read-models/TheatreWithCity';

export interface ITheatreQueryService {
  findByAdminId(adminId: string): Promise<TheatreWithCity[]>;
  getOverview(theatreId: string, adminId: string): Promise<TheatreOverview | null>;
}
