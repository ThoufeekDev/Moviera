import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListCitiesUseCase } from '../../application/queries/ListCitiesUseCase';
import { CityOption } from '../../application/read-models/CityOption';

export class ListCitiesController {
  constructor(private readonly listCitiesUseCase: ListCitiesUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse<CityOption[]>> => {
    const cities = await this.listCitiesUseCase.execute();
    return ok(cities);
  };
}
