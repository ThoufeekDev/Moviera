import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { RefreshTokenUseCase } from '../../application/commands/RefreshTokenUseCase';
import { buildAccessTokenCookie } from '../../../../shared/utils/authCookies';

export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  handle = async (req: HttpRequest): Promise<HttpResponse> => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    try {
      const { accessToken } =
        await this.refreshTokenUseCase.execute(refreshToken);

      return ok(undefined, 'Access token refreshed', {
        cookies: [buildAccessTokenCookie(accessToken)],
      });
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  };
}
