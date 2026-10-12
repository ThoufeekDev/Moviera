import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { GetProfileUseCase } from '../../application/queries/GetProfileUseCase';

export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  handle = async (req: HttpRequest): Promise<HttpResponse> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.getProfileUseCase.execute(req.user.userId);
    return ok(result.user, 'Get Profile succes');
  };
}
