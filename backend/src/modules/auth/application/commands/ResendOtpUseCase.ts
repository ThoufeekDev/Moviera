import { ConflictError } from '../../../../shared/errors/ConflictError';
import { generateOtp } from '../../../../shared/utils/generateOtp';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ResendOTP } from '../dtos/requests/ResendOtpDTO';
import { IOtpRepository } from '../../domain/repositories/IOtpRepository';
import { IOtpNotificationService } from '../../domain/services/IOtpNotificationService';

export class ResendOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository: IOtpRepository,
    private readonly otpNotificationService: IOtpNotificationService,
  ) {}

  async execute(user: ResendOTP) {
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (!existingUser) {
      throw new ConflictError('User not found');
    }

    if (existingUser.isVerified) {
      throw new ConflictError('User is already verified');
    }

    const otp = generateOtp();
    const OTP_EXPIRY_SECONDS = 50;

    await this.otpRepository.saveOtp(user.email, otp, OTP_EXPIRY_SECONDS);
    const otpExpireAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;

    await this.otpNotificationService.sendOtp(user.email, otp);

    return {
      email: user.email,
      otpExpireAt,
    };
  }
}
