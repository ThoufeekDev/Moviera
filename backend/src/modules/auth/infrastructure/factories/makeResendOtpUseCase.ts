import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import {recendOTPUseCase} from "../../application/use-cases/resendOTPUseCase"
export function makeResendOtpUseCase() {
    const userRepository = new PrismaUserRepository();
    return new recendOTPUseCase(userRepository)
}