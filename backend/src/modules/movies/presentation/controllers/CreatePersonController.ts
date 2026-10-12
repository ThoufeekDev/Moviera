import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { created } from "../../../../shared/http/response";
import { CreatePersonUseCase } from "../../application/commands/CreatePersonUseCase";
import { PersonResponseMapper } from "../response-mappers/PersonResponseMapper";

interface CreatePersonBody {
  name: string;
}

export class CreatePersonController {
  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
  ) {}

  handle = async (req: HttpRequest<unknown, CreatePersonBody>): Promise<HttpResponse> => {
    const file = req.file ?? req.files?.image?.[0];

    const person = await this.createPersonUseCase.execute({
      name: req.body.name,
      imageFile: file ? { buffer: file.buffer } : undefined,
    });

    return created(PersonResponseMapper.toResponse(person), "Person created successfully");
  };
}