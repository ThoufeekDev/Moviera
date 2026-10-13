import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { RevokeTheatreAdminAssignmentUseCase } from '../../application/commands/RevokeTheatreAdminAssignmentUseCase';
import { RevokeTheatreAdminAssignmentParamInput } from '../schemas/RevokeTheatreAdminAssignmentSchema';

export class RevokeTheatreAdminAssignmentController {
  constructor(
    private readonly revokeTheatreAdminAssignmentUseCase: RevokeTheatreAdminAssignmentUseCase,
  ) {}

  handle = async (
    req: HttpRequest<RevokeTheatreAdminAssignmentParamInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    await this.revokeTheatreAdminAssignmentUseCase.execute({
      assignmentId: req.params.assignmentId,
    });

    return ok(undefined, 'Theatre admin assignment revoked successfully.');
  };
}
