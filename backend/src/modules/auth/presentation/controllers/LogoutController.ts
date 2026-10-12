import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';

export class LogoutController {
  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    return ok(undefined, 'Logged out successfully', {
      clearCookies: [
        { name: 'accessToken', options: { httpOnly: true, sameSite: 'lax' } },
        { name: 'refreshToken', options: { httpOnly: true, sameSite: 'lax' } },
      ],
    });
  };
}
