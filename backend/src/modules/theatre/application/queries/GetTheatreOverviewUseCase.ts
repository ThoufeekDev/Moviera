import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { ITheatreQueryService } from '../ports/ITheatreQueryService';
import type { TheatreOverview } from '../read-models/TheatreOverview';
import type { Role } from '../../../../shared/enums/Role';
import type { TheatreAccessActor,ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';
export class GetTheatreOverviewUseCase {
  constructor(
    private readonly theatreQueryService: ITheatreQueryService,
    private readonly theatreAccessPolicy:ITheatreAccessPolicy
  
  ) { }

  async execute(theatreId: string,actor:TheatreAccessActor): Promise<TheatreOverview> {
    if (!theatreId) {
      throw new BadRequestError('Theatre ID is required');
    }

    if (!actor.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    await this.theatreAccessPolicy.assertCanManage(actor,theatreId)

    const theatre = await this.theatreQueryService.getOverview(theatreId,actor.userId);
    if (!theatre) {
      throw new NotFoundError('Theatre not found');
    }

    return theatre;
  }
}
