import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dtos/response/UserResponseDTO';

export class UserMapper {
  static toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
