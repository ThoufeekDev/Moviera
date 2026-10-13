import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { UpdateTheatreAdminAssignmentUseCase } from '../../application/commands/UpdateTheatreAdminAssignmentUseCase';
import {
  UpdateTheatreAdminAssignmentBodyInput,
  UpdateTheatreAdminAssignmentParamInput,
} from '../schemas/UpdateTheatreAdminAssignmentSchema';

export class UpdateTheatreAdminAssignmentController {
  constructor(
    private readonly updateTheatreAdminAssignmentUseCase: UpdateTheatreAdminAssignmentUseCase,
  ) {}

  handle = async (
    req: HttpRequest<
      UpdateTheatreAdminAssignmentParamInput,
      UpdateTheatreAdminAssignmentBodyInput
    >,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.updateTheatreAdminAssignmentUseCase.execute({
      assignmentId: req.params.assignmentId,
      isActive: req.body.isActive,
      role: req.body.role,
    });

    return ok(result, 'Theatre admin assignment updated successfully.');
  };
}
