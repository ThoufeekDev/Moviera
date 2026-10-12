import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { ListLanguagesUseCase } from "../../application/queries/ListLanguagesUseCase";

export class ListLanguagesController {
  constructor(private readonly useCase: ListLanguagesUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const languages = await this.useCase.execute();
    return ok(languages, "Languages fetched successfully");
  };
}