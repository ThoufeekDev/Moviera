import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ViewTheatreDetailPageForSuperAdmin } from '../../application/queries/ViewTheatreDetailPageForSuperAdmin';
import { SuperAdminTheatreDetail } from '../../application/read-models/SuperAdminTheatreDetail';

export interface GetSuperAdminTheatreDetailParams {
  theatreId: string;
}

export class GetSuperAdminTheatreDetailController {
  constructor(
    private readonly viewTheatreDetailPageForSuperAdmin: ViewTheatreDetailPageForSuperAdmin,
  ) {}

  handle = async (
    req: HttpRequest<GetSuperAdminTheatreDetailParams>,
  ): Promise<HttpResponse<SuperAdminTheatreDetail>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const detail = await this.viewTheatreDetailPageForSuperAdmin.execute(
      req.params.theatreId,
    );

    return ok(detail, 'Theatre details retrieved successfully');
  };
}
