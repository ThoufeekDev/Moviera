import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { SuperAdminTheatreDetail } from '../read-models/SuperAdminTheatreDetail';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';

export class ViewTheatreDetailPageForSuperAdmin
  implements IUseCase<string, SuperAdminTheatreDetail>
{
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(theatreId: string): Promise<SuperAdminTheatreDetail> {
    if (!theatreId || !theatreId.trim()) {
      throw new BadRequestError('Theatre ID is required');
    }

    const detail = await this.theatreQueryService.getTheatreDetailForSuperAdmin(theatreId.trim());
    if (!detail) {
      throw new NotFoundError('Theatre not found');
    }

    return detail;
  }
}

export { ViewTheatreDetailPageForSuperAdmin as ViewTheatreDetailPageForSuperAdminUseCase };
