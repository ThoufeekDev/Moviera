import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../../application/dtos/response/UserResponseDTO';

export class UserResponseMapper {
  static toResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
