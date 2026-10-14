import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { status } from '../../domain/enums/status';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { SuperAdminTheatreListItem } from '../read-models/SuperAdminTheatreListItem';

export interface ListTheatresForAdminRequest {
  query?: {
    search?: string;
    city?: string;
    status?: status;
    limit?: number;
    page?: number;
  };
}

export class ListTheatresForAdminUseCase implements IUseCase<ListTheatresForAdminRequest, SuperAdminTheatreListItem[]> {
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(request: ListTheatresForAdminRequest): Promise<SuperAdminTheatreListItem[]> {
    return this.theatreQueryService.listForSuperAdmin(request.query);
  }
}
