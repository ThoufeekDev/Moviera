import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { GetLanguageUseCase } from "../../application/queries/GetLanguageUseCase";

export class GetLanguageController {
  constructor(private readonly useCase: GetLanguageUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const languages = await this.useCase.execute();
    return ok(languages, "Languages fetched successfully");
  };
}