import { OAuth2Client } from 'google-auth-library';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { GoogleLoginUseCase } from '../../application/commands/GoogleLoginUseCase';
import { buildAuthCookies } from '../../../../shared/utils/authCookies';

interface GoogleLoginRequestBody {
  credential?: string;
}

export class GoogleLoginController {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    googleClient?: OAuth2Client,
  ) {
    this.googleClient =
      googleClient ?? new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  handle = async (
    req: HttpRequest<unknown, GoogleLoginRequestBody>,
  ): Promise<HttpResponse> => {
    const { credential } = req.body;

    if (!credential) {
      throw new BadRequestError('Google credential is required');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = await this.googleLoginUseCase.execute({
      googleId: payload!.sub!,
      email: payload!.email!,
      name: payload!.name!,
      avatar: payload!.picture ?? null,
    });

    const cookies = buildAuthCookies(user.id, user.role);

    return ok(user, 'Google succesfully Logined', { cookies });
  };
}
