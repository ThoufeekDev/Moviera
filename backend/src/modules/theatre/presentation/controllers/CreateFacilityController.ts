import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { CreateFacilityUseCase } from '../../application/commands/CreateFacilityUseCase';
import { CreateFacilityInput } from '../schemas/CreateFacilitySchema';

export class CreateFacilityController {
  constructor(private readonly createFacilityUseCase: CreateFacilityUseCase) {}

  handle = async (
    req: HttpRequest<unknown, CreateFacilityInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.createFacilityUseCase.execute({
      name: req.body.name,
      description: req.body.description,
      iconKey: req.body.iconKey,
    });

    return created(result, 'Facility created successfully.');
  };
}
