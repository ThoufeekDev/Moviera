import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

// Validators
import { registerSchema } from '../validators/register.validator';
import { loginSchema } from '../validators/login.validator';
import { verifyUserOtpSchema } from '../validators/verifyOtp.validator';

// Application
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase';

// Infrastructure - Factories
import { makeRegisterUserUseCase } from '../../infrastructure/factories/makeRegisterUserUseCase';
import { makeLoginUserCase } from '../../infrastructure/factories/makeLoginUserCase';
import { makeGetProfileUserUseCase } from '../../infrastructure/factories/makeGetProfileUserUseCase';
import { makeVerifyOTPUseCase } from '../../infrastructure/factories/makeVerifyOtpUseCase';
import { makeResendOtpUseCase } from '../../infrastructure/factories/makeResendOtpUseCase';
import { makeGoogleLoginUseCase } from '../../infrastructure/factories/makeGoogleLoginUseCase';

// Shared - Errors
import { BadRequestError } from '../../../../shared/exceptions/BadRequestError';
import { UnauthorizedError } from '../../../../shared/exceptions/UnauthorizedError';

// Shared - HTTP Utilities
import { successResponse } from '../../../../shared/utils/response';
import { setAccessTokenCookie, setAuthCookies } from '../../../../shared/utils/authCookies';

// Shared - Types
import { AuthenticatedRequest } from '../../../../shared/types/AuthenticateRequest';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);

    const useCase = makeRegisterUserUseCase();

    const response = await useCase.execute(validatedData);

    successResponse(res, 201, true, 'OTP sent to email', response);
  }

  async verifyOtp(req: Request, res: Response) {
    const validatedData = verifyUserOtpSchema.parse(req.body);

    const verifyOtpUseCase = makeVerifyOTPUseCase();

    const result = await verifyOtpUseCase.execute(validatedData);

    setAuthCookies(res, result.user.id, result.user.role);

    successResponse(res, 201, true, 'OTP Verify successfuly', result);
  }

  async resendOTP(req: Request, res: Response) {
    const { email } = req.body;

    const resendUserCase = makeResendOtpUseCase();

    const result = await resendUserCase.execute({ email });

    successResponse(res, 200, true, 'OTP resent succesfully', result);
  }

  async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);

    const loginUserUseCase = makeLoginUserCase();

    const result = await loginUserUseCase.execute(validatedData);

    setAuthCookies(res, result.user.id, result.user.role);

    return successResponse(res, 200, true, 'Login succesful', result.user);
  }

  async googleLogin(req: Request, res: Response) {
    const { credential } = req.body;


    if (!credential) {
      throw new BadRequestError('Google credential is required');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleLoginUseCase = makeGoogleLoginUseCase();

    const user = await googleLoginUseCase.execute({
      googleId: payload!.sub!,
      email: payload!.email!,
      name: payload!.name!,
      profileImage: payload!.picture ?? null,
    });

    setAuthCookies(res, user.id, user.role);

    successResponse(res, 200, true, 'Google succesfully Logined', user);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    const refreshTokenUseCase = new RefreshTokenUseCase();

    const { accessToken } = await refreshTokenUseCase.execute(refreshToken);

    setAccessTokenCookie(res, accessToken);

    successResponse(res, 200, true, 'Access token refreshed');
  }

  // logout method

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    successResponse(res, 200, true, 'Logged out successfully');
  }

  // profile

  async profile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const getProfileUserUseCase = makeGetProfileUserUseCase();

    const result = await getProfileUserUseCase.execute(userId!);

    successResponse(res, 200, true, 'Get Profile succes', result.user);
  }
}

// async googleLogin(req: Request, res: Response) {
//   try {
//     const { credential } = req.body;

//     // console.log('Google credential received:', !!credential);

//     if (!credential) {
//       // return res.status(400).json({
//       //   success: false,
//       //   message: 'Google credential is required',
//       // });

//       throw new BadRequestError('Google credential is required');
//     }

//     const ticket = await googleClient.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     const googleLoginUseCase = makeGoogleLoginUseCase();

//     const user = await googleLoginUseCase.execute({
//       googleId: payload!.sub!,
//       email: payload!.email!,
//       name: payload!.name!,
//       profileImage: payload!.picture ?? null,
//     });

//     setAuthCookies(res, user.id, user.role);

//     successResponse(res, 200, true, 'Google succesfully Logined', user);
//   } catch (error) {
//     console.error('Google verification failed:', error);

//     return res.status(401).json({
//       success: false,
//       message: 'Invalid Google credential',
//     });
//   }
// }
