import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { LoginUserUseCase } from '../../application/commands/LoginUserUseCase';
import { LoginUserDTO } from '../../application/dtos/requests/LoginUserDTO';
import { UserResponseDTO } from '../../application/dtos/response/UserResponseDTO';
import { buildAuthCookies } from '../../../../shared/utils/authCookies';

export class LoginController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  handle = async (
    req: HttpRequest<unknown, LoginUserDTO>,
  ): Promise<HttpResponse<UserResponseDTO>> => {
    const result = await this.loginUserUseCase.execute(req.body);
    const cookies = buildAuthCookies(result.user.id, result.user.role);

    return ok(result.user, 'Login succesful', { cookies });
  };
}
