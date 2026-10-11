import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { GetPersonsUseCase } from "../../application/queries/GetPersonUseCase";

export class GetPersonController {
  constructor(private readonly useCase: GetPersonsUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const people = await this.useCase.execute();
    return ok(people, "People fetched successfully");
  };
}