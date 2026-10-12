import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { GetTheatreOverviewUseCase } from "../../application/queries/GetTheatreOverviewUseCase";
import { TheatreResponseMapper } from "../response-mappers/TheatreResponseMapper";

export interface GetTheatreOverviewParams {
  theatreId: string;
}

export class GetTheatreOverviewController {
  constructor(
    private readonly getTheatreOverviewUseCase: GetTheatreOverviewUseCase,
  ) {}

  handle = async (
    req: HttpRequest<GetTheatreOverviewParams>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const overview = await this.getTheatreOverviewUseCase.execute(
      req.params.theatreId,
      req.user.userId,
    );

    const data = {
      ...overview,
      theatre: TheatreResponseMapper.toResponse(
        overview.theatre.theatre,
        overview.theatre.city,
      ),
    };

    return ok(data, "Theatre overview retrieved successfully");
  };
}