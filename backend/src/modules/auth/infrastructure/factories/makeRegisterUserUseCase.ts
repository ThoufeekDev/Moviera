import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { RedisOtpRepository } from '../repositories/RedisOtpRepository';
import { BullMQOtpNotificationService } from '../services/BullMQOtpNotificationService';  
export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const otpRepository = new RedisOtpRepository()
  const otpNotificationService = new BullMQOtpNotificationService();

  return new RegisterUserUseCase(
    userRepository,
    otpRepository,
    otpNotificationService
  );
}
