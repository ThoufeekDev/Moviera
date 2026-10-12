import { Router } from 'express';
import { authenticateUser } from '../../../../shared/middleware/authenticateUser';
import { otpRateLimit } from '../../../../shared/middleware/rateLimit.middleware';
import { verifyTurnStile } from '../../../../shared/middleware/verifyTurnstile.middleware';
import { validate } from '../../../../shared/middleware/validate';
import { adapt } from '../../../../shared/http/expressAdapter';

import { registerSchema } from '../schemas/RegisterSchema';
import { loginSchema } from '../schemas/LoginSchema';
import { verifyUserOtpSchema } from '../schemas/VerifyOtpSchema';
import { resendOtpSchema } from '../schemas/ResendOtpSchema';
import { googleLoginSchema } from '../schemas/GoogleLoginSchema';

import { RegisterController } from '../controllers/RegisterController';
import { VerifyOtpController } from '../controllers/VerifyOtpController';
import { ResendOtpController } from '../controllers/ResendOtpController';
import { LoginController } from '../controllers/LoginController';
import { GoogleLoginController } from '../controllers/GoogleLoginController';
import { RefreshTokenController } from '../controllers/RefreshTokenController';
import { LogoutController } from '../controllers/LogoutController';
import { GetProfileController } from '../controllers/GetProfileController';

export interface AuthRouteControllers {
  registerController: RegisterController;
  verifyOtpController: VerifyOtpController;
  resendOtpController: ResendOtpController;
  loginController: LoginController;
  googleLoginController: GoogleLoginController;
  refreshTokenController: RefreshTokenController;
  logoutController: LogoutController;
  getProfileController: GetProfileController;
}

export function createAuthRoutes(controllers: AuthRouteControllers): Router {
  const router = Router();

  // Register & OTP routes
  router.post(
    '/register',
    verifyTurnStile,
    otpRateLimit,
    validate({ body: registerSchema }),
    adapt(controllers.registerController.handle),
  );

  router.post(
    '/resend-otp',
    validate({ body: resendOtpSchema }),
    adapt(controllers.resendOtpController.handle),
  );

  router.post(
    '/verify-otp',
    validate({ body: verifyUserOtpSchema }),
    adapt(controllers.verifyOtpController.handle),
  );

  // Login & Session routes
  router.post(
    '/login',
    validate({ body: loginSchema }),
    adapt(controllers.loginController.handle),
  );

  router.post('/logout', adapt(controllers.logoutController.handle));

  router.post(
    '/google',
    validate({ body: googleLoginSchema }),
    adapt(controllers.googleLoginController.handle),
  );

  // Refresh token
  router.post('/refresh-token', adapt(controllers.refreshTokenController.handle));

  // Profile
  router.get('/profile', authenticateUser, adapt(controllers.getProfileController.handle));

  return router;
}
