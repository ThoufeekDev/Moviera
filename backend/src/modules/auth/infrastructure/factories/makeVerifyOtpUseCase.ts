import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { VerifyOtpUseCase } from '../../application/use-cases/VerifyOtpUseCase';
import { RedisOtpRepository } from '../repositories/RedisOtpRepository';

export function makeVerifyOTPUseCase() {
  const userRepository = new PrismaUserRepository();
    const otpRepository = new RedisOtpRepository()


  return new VerifyOtpUseCase(userRepository,otpRepository,);
}
