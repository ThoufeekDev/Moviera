import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Role } from '../../../../shared/enums/Role';

export class GoogleLoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: {
    googleId: string;
    email: string;
    name: string;
    profileImage: string | null;
  }) {
    const existingGoogleUser = await this.userRepository.findByGoogleId(data.googleId);
    const existingEmailUser = await this.userRepository.findByEmail(data.email);
    if (existingGoogleUser) {
      return existingGoogleUser;
    }

    if (existingEmailUser) {
      return this.userRepository.linkGoogleAccount(existingEmailUser.id, data.googleId);
    }

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: null,
      googleId: data.googleId,
      role: Role.USER,
      isVerified: true,
    });

    return newUser;
  }
}
