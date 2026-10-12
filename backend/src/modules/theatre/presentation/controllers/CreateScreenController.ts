import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { created } from "../../../../shared/http/response";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { CreateScreenUseCase } from "../../application/commands/CreateScreenUseCase";

interface CreateScreenRequestBody {
  theatreId: string;
  name: string;
}

export class CreateScreenController {
  constructor(private readonly createScreenUseCase: CreateScreenUseCase) {}

  handle = async (
    req: HttpRequest<unknown, CreateScreenRequestBody>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const screen = await this.createScreenUseCase.execute({
      theatreId: req.body.theatreId,
      name: req.body.name,
      adminId: req.user.userId,
    });

    return created(screen, "Screen created successfully");
  };
}