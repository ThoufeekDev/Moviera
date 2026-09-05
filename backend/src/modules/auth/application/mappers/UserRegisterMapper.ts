import { User } from '../../domain/entities/User';

import { UserResponserRegisterDTO } from '../dtos/response/UserResponseRegisterDTO';

export class UserRegisterMapper {
  static toResponseDTO(user: User, otpExpireIn: number): UserResponserRegisterDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      otpExpireIn,
    };
  }
}
