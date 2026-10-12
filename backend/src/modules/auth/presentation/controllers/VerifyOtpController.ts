import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { VerifyOtpUseCase } from '../../application/commands/VerifyOtpUseCase';
import { verifyOtpDTO } from '../../application/dtos/requests/VerifyOtpDTO';
import { buildAuthCookies } from '../../../../shared/utils/authCookies';

export class VerifyOtpController {
  constructor(private readonly verifyOtpUseCase: VerifyOtpUseCase) {}

  handle = async (
    req: HttpRequest<unknown, verifyOtpDTO>,
  ): Promise<HttpResponse> => {
    const result = await this.verifyOtpUseCase.execute(req.body);
    const cookies = buildAuthCookies(result.user.id, result.user.role);

    return created(result, 'OTP Verify successfuly', { cookies });
  };
}
