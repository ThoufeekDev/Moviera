import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { ITheatreQueryService } from '../ports/ITheatreQueryService';
import type { TheatreOverview } from '../read-models/TheatreOverview';

export class GetTheatreOverviewUseCase {
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(theatreId: string, adminId: string): Promise<TheatreOverview> {
    if (!theatreId) {
      throw new BadRequestError('Theatre ID is required');
    }

    if (!adminId) {
      throw new UnauthorizedError('Authentication required');
    }

    const theatre = await this.theatreQueryService.getOverview(theatreId, adminId);
    if (!theatre) {
      throw new NotFoundError('Theatre not found');
    }

    return theatre;
  }
}
