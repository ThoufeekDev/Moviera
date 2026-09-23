import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { ResendOtpUseCase } from "../../application/use-cases/resendOTPUseCase"
import { RedisOtpRepository } from '../repositories/RedisOtpRepository';
import { BullMQOtpNotificationService } from "../services/BullMQOtpNotificationService";
export function makeResendOtpUseCase() {
    const userRepository = new PrismaUserRepository();
    const otpRepository = new RedisOtpRepository()
    const otpNotificationService = new BullMQOtpNotificationService();
    return new ResendOtpUseCase(userRepository,otpRepository,otpNotificationService)
}