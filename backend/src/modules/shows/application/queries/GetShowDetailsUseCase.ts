import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { ITheatreAccessPolicy, TheatreAccessActor } from '../../../theatre';
import type { IShowQueryService } from '../ports/IShowQueryService';
import type { ShowDetail } from '../read-models/ShowDetail';

export interface GetShowDetailsRequest {
  actor: TheatreAccessActor;
  showId: string;
}

export class GetShowDetailsUseCase implements IUseCase<GetShowDetailsRequest, ShowDetail> {
  constructor(
    private readonly showQueryService: IShowQueryService,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(request: GetShowDetailsRequest): Promise<ShowDetail> {
    const detail = await this.showQueryService.findShowDetailById(request.showId);
    if (!detail) {
      throw new NotFoundError('Show not found');
    }

    const canManage = await this.theatreAccessPolicy.canManage(
      request.actor,
      detail.theatre.id,
    );
    if (!canManage) {
      throw new ForbiddenError('You do not have permission to view this show');
    }

    return detail;
  }
}

