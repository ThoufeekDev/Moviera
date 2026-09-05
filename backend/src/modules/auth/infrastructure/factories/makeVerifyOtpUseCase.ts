import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { VerifyOtpUseCase } from '../../application/use-cases/VerifyOtpUseCase';

export function makeVerifyOTPUseCase() {
  const userRepository = new PrismaUserRepository();
  return new VerifyOtpUseCase(userRepository);
}
