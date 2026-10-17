import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { ActiveFacilityOption } from '../read-models/ActiveFacilityOption';

export class ListActiveFacilitiesUseCase
  implements IUseCase<void, ActiveFacilityOption[]>
{
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(): Promise<ActiveFacilityOption[]> {
    return this.theatreQueryService.listActiveFacilities();
  }
}
