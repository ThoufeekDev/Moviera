import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { CreateTheatreUseCase } from '../../application/commands/CreateTheatreUseCase';
import { CreateTheatreInput } from '../schemas/CreateTheatreSchema';
import { CreatedTheatreResult } from '../../application/read-models/CreatedTheatreResult';

export class CreateTheatreController {
  constructor(private readonly createTheatreUseCase: CreateTheatreUseCase) {}

  handle = async (
    req: HttpRequest<unknown, CreateTheatreInput, unknown>,
  ): Promise<HttpResponse<CreatedTheatreResult>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const singleFile = req.file;
    const fieldsLogo = req.files?.logo?.[0];
    const fileToUse = singleFile ?? fieldsLogo;

    const result = await this.createTheatreUseCase.execute({
      ...req.body,
      createdById: req.user.userId,
      logoFile: fileToUse ? { buffer: fileToUse.buffer } : undefined,
    });

    return created(result, 'Theatre created successfully');
  };
}
