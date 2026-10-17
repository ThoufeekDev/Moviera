import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { EditFacilityUseCase } from '../../application/commands/EditFacilityUseCase';
import {
  EditFacilityBodyInput,
  EditFacilityParamInput,
} from '../schemas/EditFacilitySchema';

export class EditFacilityController {
  constructor(private readonly editFacilityUseCase: EditFacilityUseCase) {}

  handle = async (
    req: HttpRequest<EditFacilityParamInput, EditFacilityBodyInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.editFacilityUseCase.execute({
      id: req.params.facilityId,
      name: req.body.name,
      description: req.body.description,
      iconKey: req.body.iconKey,
    });

    return ok(result, 'Facility updated successfully.');
  };
}
