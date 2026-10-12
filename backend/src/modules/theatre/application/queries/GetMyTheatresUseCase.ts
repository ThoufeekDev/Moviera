import type { ITheatreQueryService } from '../ports/ITheatreQueryService';
import type { TheatreWithCity } from '../read-models/TheatreWithCity';

export class GetMyTheatresUseCase {
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(adminId: string): Promise<TheatreWithCity[]> {
    return await this.theatreQueryService.findByAdminId(adminId);
  }
}
