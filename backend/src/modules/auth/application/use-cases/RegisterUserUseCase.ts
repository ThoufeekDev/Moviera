import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { RegisterUserDTO } from '../dtos/requests/RegisterUserDTO';

// import {AuthResponse} from "../../domain/entities/User"
import { UserResponseDTO } from '../dtos/response/UserResponseDTO';

import { generateOtp } from '../../../../shared/utils/generateOtp';
import { redis } from '../../../../shared/redis_config/redis';
import { otpQueue } from '../../../../shared/queues/otp.queue';
// utils
import { hashPassword } from '../../../../shared/utils/hashPassword';

import { ConflictError } from '../../../../shared/exceptions/ConflictError';
import { UserRegisterMapper } from '../mappers/UserRegisterMapper';
import { UserResponserRegisterDTO } from '../dtos/response/UserResponseRegisterDTO';

// user signup(register) useCase
export class RegisterUserUseCase {
  // dependancy injection
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO): Promise<UserResponserRegisterDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashpassword = await hashPassword(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashpassword,
      role: data.role,
      isVerified: false,
    });

    const otp = generateOtp();
    const OTP_EXPIRY_SECONDS = 50;

    await redis.set(`otp:${user.email}`, otp, 'EX', OTP_EXPIRY_SECONDS);
    const otpExpireAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;
    await otpQueue.add(
      'send-otp-email',
      {
        email: user.email,
        otp,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );

    const userResponse = UserRegisterMapper.toResponseDTO(user, otpExpireAt);

    return userResponse;
  }
}
