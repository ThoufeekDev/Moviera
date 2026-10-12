import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { GetMyTheatresUseCase } from "../../application/queries/GetMyTheatresUseCase";
import { TheatreResponseMapper } from "../response-mappers/TheatreResponseMapper";

export class GetMyTheatresController {
  constructor(private readonly getMyTheatresUseCase: GetMyTheatresUseCase) {}

  handle = async (req: HttpRequest): Promise<HttpResponse> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const theatres = await this.getMyTheatresUseCase.execute(req.user.userId);
    const data = TheatreResponseMapper.toResponseList(theatres);

    return ok(data, "Theatres retrieved successfully");
  };
}