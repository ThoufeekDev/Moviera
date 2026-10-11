import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { GetPersonByIdUseCase } from "../../application/queries/GetPersonByIdUseCase";

interface GetPersonByIdParams {
  id: string;
}

export class GetPersonByIdController {
  constructor(private readonly getPersonByIdUseCase: GetPersonByIdUseCase) {}

  handle = async (req: HttpRequest<GetPersonByIdParams>): Promise<HttpResponse> => {
    const person = await this.getPersonByIdUseCase.execute(req.params.id);
    return ok(person, "Person fetched successfully");
  };
}
