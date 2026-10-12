import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { RegisterUserUseCase } from '../../application/commands/RegisterUserUseCase';
import { RegisterUserDTO } from '../../application/dtos/requests/RegisterUserDTO';

export class RegisterController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  handle = async (
    req: HttpRequest<unknown, RegisterUserDTO>,
  ): Promise<HttpResponse> => {
    const response = await this.registerUserUseCase.execute(req.body);
    return created(response, 'OTP sent to email');
  };
}
