import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';

export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUserRepository();

  return new RegisterUserUseCase(userRepository);
}
