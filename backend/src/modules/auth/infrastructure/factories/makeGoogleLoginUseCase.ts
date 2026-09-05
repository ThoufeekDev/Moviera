import { GoogleLoginUseCase } from '../../application/use-cases/GoogleLoginUseCase';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';

export function makeGoogleLoginUseCase() {
  const userRepository = new PrismaUserRepository();

  return new GoogleLoginUseCase(userRepository);
}
