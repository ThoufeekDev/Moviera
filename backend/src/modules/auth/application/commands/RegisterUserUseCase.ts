import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { RegisterUserDTO } from '../dtos/requests/RegisterUserDTO';
import { generateOtp } from '../../../../shared/utils/generateOtp';
import { hashPassword } from '../../../../shared/utils/hashPassword';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { UserRegisterMapper } from '../mappers/UserRegisterMapper';
import { UserResponserRegisterDTO } from '../dtos/response/UserResponseRegisterDTO';
import { IOtpRepository } from '../../domain/repositories/IOtpRepository';
import { IOtpNotificationService } from '../../domain/services/IOtpNotificationService';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository: IOtpRepository,
    private readonly otpNotificationService: IOtpNotificationService,
  ) {}

  async execute(data: RegisterUserDTO): Promise<UserResponserRegisterDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      isVerified: false,
    });

    const otp = generateOtp();
    const OTP_EXPIRY_SECONDS = 50;

    await this.otpRepository.saveOtp(user.email, otp, OTP_EXPIRY_SECONDS);
    const otpExpireAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;

    await this.otpNotificationService.sendOtp(user.email, otp);

    return UserRegisterMapper.toResponseDTO(user, otpExpireAt);
  }
}
