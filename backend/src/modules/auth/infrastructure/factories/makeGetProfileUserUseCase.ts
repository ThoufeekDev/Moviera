import { GetProfileUseCase } from '../../application/use-cases/GetProfileUseCase';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';

export function makeGetProfileUserUseCase() {
  const userRepository = new PrismaUserRepository();

  return new GetProfileUseCase(userRepository);
}
