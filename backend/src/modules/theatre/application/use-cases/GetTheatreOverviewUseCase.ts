
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { UnauthorizedError } from '../../../../shared/exceptions/UnauthorizedError';
import { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import { TheatreOverview } from '../../domain/types/TheatreOverView';

export class GetTheatreOverviewUseCase {
  constructor(private readonly theatreRepository: ITheatreRepository) {}

  async execute(theatreId: string, adminId: string): Promise<TheatreOverview> {
    if (!theatreId) {
      throw new UnauthorizedError('Theatre ID is required');
    }

    if (!adminId) {
      throw new UnauthorizedError('Authentication required');
    }

    const theatre = await this.theatreRepository.getOverView(theatreId, adminId);
    if (!theatre) {
  throw new NotFoundError('Theatre not found');
}

    return theatre;
  }
}
