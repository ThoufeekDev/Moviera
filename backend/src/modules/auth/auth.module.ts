import { PrismaClient } from '@prisma/client';
import type Redis from 'ioredis';
import { redis } from '../../shared/infrastructure/redis/redis.client';

import { PrismaUserRepository } from './infrastructure/persistence/repositories/PrismaUserRepository';
import { RedisOtpRepository } from './infrastructure/persistence/repositories/RedisOtpRepository';
import { BullMQOtpNotificationService } from './infrastructure/services/BullMQOtpNotificationService';

import { RegisterUserUseCase } from './application/commands/RegisterUserUseCase';
import { VerifyOtpUseCase } from './application/commands/VerifyOtpUseCase';
import { ResendOtpUseCase } from './application/commands/ResendOtpUseCase';
import { LoginUserUseCase } from './application/commands/LoginUserUseCase';
import { GoogleLoginUseCase } from './application/commands/GoogleLoginUseCase';
import { RefreshTokenUseCase } from './application/commands/RefreshTokenUseCase';
import { GetProfileUseCase } from './application/queries/GetProfileUseCase';

import { RegisterController } from './presentation/controllers/RegisterController';
import { VerifyOtpController } from './presentation/controllers/VerifyOtpController';
import { ResendOtpController } from './presentation/controllers/ResendOtpController';
import { LoginController } from './presentation/controllers/LoginController';
import { GoogleLoginController } from './presentation/controllers/GoogleLoginController';
import { RefreshTokenController } from './presentation/controllers/RefreshTokenController';
import { LogoutController } from './presentation/controllers/LogoutController';
import { GetProfileController } from './presentation/controllers/GetProfileController';

import { createAuthRoutes } from './presentation/routes/auth.routes';

export function buildAuthModule(
  prisma: PrismaClient,
  redisClient: Redis = redis,
) {
  // Repositories & Services
  const userRepository = new PrismaUserRepository(prisma);
  const otpRepository = new RedisOtpRepository(redisClient);
  const otpNotificationService = new BullMQOtpNotificationService();

  // Use Cases
  const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    otpRepository,
    otpNotificationService,
  );
  const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, otpRepository);
  const resendOtpUseCase = new ResendOtpUseCase(
    userRepository,
    otpRepository,
    otpNotificationService,
  );
  const loginUserUseCase = new LoginUserUseCase(userRepository);
  const googleLoginUseCase = new GoogleLoginUseCase(userRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase();
  const getProfileUseCase = new GetProfileUseCase(userRepository);

  // Controllers
  const registerController = new RegisterController(registerUserUseCase);
  const verifyOtpController = new VerifyOtpController(verifyOtpUseCase);
  const resendOtpController = new ResendOtpController(resendOtpUseCase);
  const loginController = new LoginController(loginUserUseCase);
  const googleLoginController = new GoogleLoginController(googleLoginUseCase);
  const refreshTokenController = new RefreshTokenController(
    refreshTokenUseCase,
  );
  const logoutController = new LogoutController();
  const getProfileController = new GetProfileController(getProfileUseCase);

  // Router
  const authRouter = createAuthRoutes({
    registerController,
    verifyOtpController,
    resendOtpController,
    loginController,
    googleLoginController,
    refreshTokenController,
    logoutController,
    getProfileController,
  });

  return {
    authRouter,
    registerController,
    verifyOtpController,
    resendOtpController,
    loginController,
    googleLoginController,
    refreshTokenController,
    logoutController,
    getProfileController,
  };
}
