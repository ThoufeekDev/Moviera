import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { UpdateMovieUseCase } from '../../application/use-cases/UpdateMovieUseCase';
import { UpdateMovieDTO } from '../../application/dtos/UpdateMovieDTO';

export class UpdateMovieController {
  constructor(private readonly updateMovieUseCase: UpdateMovieUseCase) {}

  handle = async (
    req: HttpRequest<{ id: string }, UpdateMovieDTO>,
  ): Promise<HttpResponse> => {
    const posterFile = req.files?.poster?.[0];
    const backdropFile = req.files?.backdrop?.[0];

    const movieToUpdate: UpdateMovieDTO = {
      ...req.body,
      posterFile: posterFile ? { buffer: posterFile.buffer } : undefined,
      backdropFile: backdropFile ? { buffer: backdropFile.buffer } : undefined,
    };

    await this.updateMovieUseCase.execute({
      id: req.params.id,
      data: movieToUpdate,
    });

    return ok(undefined, 'Movie updated successfully');
  };
}
