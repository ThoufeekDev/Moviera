import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { CreateMovieUseCase } from '../../application/commands/CreateMovieUseCase';
import { CreateMovieDTO } from '../../application/dtos/CreateMovieDTO';

export class CreateMovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
  ) {}

  handle = async (req: HttpRequest<unknown, CreateMovieDTO, unknown>): Promise<HttpResponse> => {
    const posterFile = req.files?.poster?.[0];
    const backdropFile = req.files?.backdrop?.[0];

    await this.createMovieUseCase.execute({
      ...req.body,
      posterFile: posterFile
        ? { buffer: posterFile.buffer }
        : undefined,
      backdropFile: backdropFile
        ? { buffer: backdropFile.buffer }
        : undefined,
    });

    return created(undefined, 'Movie created successfully');
  };
}
