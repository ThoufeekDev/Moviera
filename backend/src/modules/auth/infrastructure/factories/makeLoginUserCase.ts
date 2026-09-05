import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';

export function makeLoginUserCase() {
  const userRepository = new PrismaUserRepository();

  return new LoginUserUseCase(userRepository);
}
