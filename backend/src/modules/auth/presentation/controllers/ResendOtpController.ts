import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ResendOtpUseCase } from '../../application/commands/ResendOtpUseCase';
import { ResendOTP } from '../../application/dtos/requests/ResendOtpDTO';

export class ResendOtpController {
  constructor(private readonly resendOtpUseCase: ResendOtpUseCase) {}

  handle = async (
    req: HttpRequest<unknown, ResendOTP>,
  ): Promise<HttpResponse> => {
    const result = await this.resendOtpUseCase.execute(req.body);
    return ok(result, 'OTP resent succesfully');
  };
}
