// import { redis } from '../../../../shared/redis_config/redis';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

import { verifyOtpDTO } from '../dtos/requests/VerifyOtpDTO';

// Error handler
import { UnauthorizedError } from '../../../../shared/exceptions/UnauthorizedError';
import { BadRequestError } from '../../../../shared/exceptions/BadRequestError';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { UserMapper } from '../mappers/UserMapper';
import { IOtpRepository } from '../../domain/repositories/IOtpRepository';

export class VerifyOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository:IOtpRepository,
  ) { }

  async execute(data: verifyOtpDTO) {
    // const storedOtp = await redis.get(`otp:${data.email}`);
    const storedOtp = await this.otpRepository.getOtp(`otp:${data.email}`);
    if (!storedOtp) {
      throw new BadRequestError('OTP Expired');
    }

    if (storedOtp !== data.otp) {
      throw new BadRequestError('Invalid OTP. Please try again.');
    }

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.verifyUser(user.id);

    const updatedUser = await this.userRepository.findByEmail(data.email);
    if (!updatedUser) {
      throw new UnauthorizedError('User not found');
    }

    // await redis.del(`otp:${data.email}`);
    await this.otpRepository.deleteOtp(`otp:${data.email}`)

    // const {password,...safeUser} = updatedUser

    const userResponse = UserMapper.toResponseDTO(updatedUser);

    return {
      user: userResponse,
    };
  }
}
