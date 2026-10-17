import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { PaginatedResult } from '../../../../shared/types/Pagination';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { SuperAdminFacilityListItem } from '../read-models/SuperAdminFacilityListItem';

export interface ListFacilitiesRequest {
  query?: {
    search?: string;
    status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
    limit?: number;
    page?: number;
  };
}

export class ListFacilitiesUseCase
  implements IUseCase<ListFacilitiesRequest, PaginatedResult<SuperAdminFacilityListItem>>
{
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(
    request: ListFacilitiesRequest,
  ): Promise<PaginatedResult<SuperAdminFacilityListItem>> {
    return this.theatreQueryService.listFacilities(request.query);
  }
}
