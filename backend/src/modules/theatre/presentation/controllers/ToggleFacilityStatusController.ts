import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ToggleFacilityStatusUseCase } from '../../application/commands/ToggleFacilityStatusUseCase';
import {
  ToggleFacilityStatusBodyInput,
  ToggleFacilityStatusParamInput,
} from '../schemas/ToggleFacilityStatusSchema';

export class ToggleFacilityStatusController {
  constructor(
    private readonly toggleFacilityStatusUseCase: ToggleFacilityStatusUseCase,
  ) {}

  handle = async (
    req: HttpRequest<ToggleFacilityStatusParamInput, ToggleFacilityStatusBodyInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.toggleFacilityStatusUseCase.execute({
      id: req.params.facilityId,
      isActive: req.body.isActive,
    });

    return ok(result, 'Facility status updated successfully.');
  };
}
