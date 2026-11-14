import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { Role } from '../../../../shared/enums/Role';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { PaginatedResult } from '../../../../shared/types/Pagination';
import type {
  IScreenDetailsReader,
  ITheatreAccessPolicy,
  TheatreAccessActor,
} from '../../../theatre';
import type { IShowQueryService, ListShowsQuery } from '../ports/IShowQueryService';
import type { ShowListItem } from '../read-models/ShowListItem';

export interface ListShowsRequest {
  actor: TheatreAccessActor;
  query?: Omit<ListShowsQuery, 'theatreAdminUserId'>;
}

export class ListShowsUseCase
  implements IUseCase<ListShowsRequest, PaginatedResult<ShowListItem>>
{
  constructor(
    private readonly showQueryService: IShowQueryService,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
    private readonly screenDetailsReader: IScreenDetailsReader,
  ) {}

  async execute(request: ListShowsRequest): Promise<PaginatedResult<ShowListItem>> {
    const { actor, query = {} } = request;

    if (actor.role !== Role.SUPER_ADMIN && actor.role !== Role.THEATRE_ADMIN) {
      throw new ForbiddenError('You do not have permission to list shows');
    }

    if (query.theatreId) {
      const allowed = await this.theatreAccessPolicy.canManage(actor, query.theatreId);
      if (!allowed) {
        throw new ForbiddenError('You do not have permission to view shows for this theatre');
      }
    }

    if (query.screenId) {
      const screen = await this.screenDetailsReader.findScreenDetailsById(query.screenId);
      if (!screen) {
        throw new NotFoundError('Screen not found');
      }

      if (query.theatreId && screen.theatreId !== query.theatreId) {
        throw new BadRequestError('Screen does not belong to the specified theatre', {
          field: 'screenId',
        });
      }

      const allowed = await this.theatreAccessPolicy.canManage(actor, screen.theatreId);
      if (!allowed) {
        throw new ForbiddenError('You do not have permission to view shows for this screen');
      }
    }

    return this.showQueryService.listShows({
      ...query,
      theatreAdminUserId: actor.role === Role.THEATRE_ADMIN ? actor.userId : undefined,
    });
  }
}

