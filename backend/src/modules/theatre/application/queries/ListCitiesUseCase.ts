import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { CityOption } from '../read-models/CityOption';

export class ListCitiesUseCase {
  constructor(private readonly theatreQueryService: ITheatreQueryService) {}

  async execute(): Promise<CityOption[]> {
    return this.theatreQueryService.listCities();
  }
}
