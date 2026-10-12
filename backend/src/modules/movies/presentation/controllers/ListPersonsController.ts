import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { ListPersonsUseCase } from "../../application/queries/ListPersonsUseCase";
import { PersonResponseMapper } from "../response-mappers/PersonResponseMapper";

export class ListPersonsController {
  constructor(private readonly useCase: ListPersonsUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const people = await this.useCase.execute();
    return ok(PersonResponseMapper.toListResponse(people), "People fetched successfully");
  };
}