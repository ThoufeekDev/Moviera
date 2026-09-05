import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';
import { ProfileResponseDTO } from '../dtos/response/ProfileResponseDTO';

export class GetProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<ProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Invalid credentials');
    }

    const userResponse = UserMapper.toResponseDTO(user);

    return {
      user: userResponse,
    };
  }
}
