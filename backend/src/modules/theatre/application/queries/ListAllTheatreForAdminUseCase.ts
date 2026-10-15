import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { PaginatedResult } from '../../../../shared/types/Pagination';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { SuperAdminListTheatresItems } from '../read-models/SuperAdminListTheatresItems';

export interface ListTheatreForAdminRequest {
  query?: {
    search?: string;
    status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
    limit?: number;
    page?: number;
  };
}

export class ListAllTheatreForAdminUseCase
  implements IUseCase<ListTheatreForAdminRequest, PaginatedResult<SuperAdminListTheatresItems>>
{
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(
    request: ListTheatreForAdminRequest,
  ): Promise<PaginatedResult<SuperAdminListTheatresItems>> {
    return this.theatreQueryService.ListAllTheatres(request.query);
  }
}