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

    console.log('its working');
    

    const isPasswordValid = await comparePassword(data.password, user.password);
    console.log('its working')
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }
     
    console.log('its not working...');
    
    if (!user.isVerified) {
      throw new ForbiddenError('Please verify your email');
    }

    console.log('helo wolrd');
    

    if (user.role !== data.role) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const userResponse = UserMapper.toResponseDTO(user);

    console.log('user ',userResponse);
    

    return {
      user: userResponse,
    };
  }
}
