import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { LoginUserDTO } from '../dtos/requests/LoginUserDTO';
import { comparePassword } from '../../../../shared/utils/comparePassword';

import { UserMapper } from '../mappers/UserMapper';

// Error Handling
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { UnauthorizedError } from '../../../../shared/exceptions/UnauthorizedError';
import { ForbiddenError } from '../../../../shared/exceptions/ForbiddenError';
import { LoginResponseDTO } from '../dtos/response/LoginResponseDTO';
export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundError('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenError('Please verify your email');
    }

    if (user.role !== data.role) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // const {
    //     password,
    //     ...safeUser
    // } = user;

    const userResponse = UserMapper.toResponseDTO(user);

    return {
      user: userResponse,
    };
  }
}
