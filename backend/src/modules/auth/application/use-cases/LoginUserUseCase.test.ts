import { describe, it, expect, vi } from 'vitest';

import { LoginUserUseCase } from './LoginUserUseCase';
import { Role } from '../../../../shared/enums/Role';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { comparePassword } from '../../../../shared/utils/comparePassword';
import { UnauthorizedError } from '../../../../shared/exceptions/UnauthorizedError';
import { beforeEach } from 'vitest';
import { ForbiddenError } from '../../../../shared/exceptions/ForbiddenError';

vi.mock('../../../../shared/utils/comparePassword', () => ({
  comparePassword: vi.fn(),
}));

//vi  creates a mock function
// vi.mocked(fn) tell ts this is a mock
// fn call the function

describe('LoginUserUseCase', () => {
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      verifyUser: vi.fn(),
      findById: vi.fn(),
      findByGoogleId: vi.fn(),
      linkGoogleAccount:vi.fn()
    };
  });

  it('should throw an error when user does not exist', async () => {
    // giving that function to Vitest's type helper.
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    const loginUserUseCase = new LoginUserUseCase(userRepository);

    await expect(
      loginUserUseCase.execute({
        email: 'unknown@gmail.com',
        password: 'password1',
        role: Role.USER,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when user password is wrong', async () => {
    const user = new User(
      'user-id-123',
      'John',
      'john@example.com',
       "googleId",
      'hashed-password',
      Role.USER,
      true,
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    vi.mocked(comparePassword).mockResolvedValue(false);

    const loginUserUseCase = new LoginUserUseCase(userRepository);

    await expect(
      loginUserUseCase.execute({
        email: 'john@example.com',
        password: 'wrong-password',
        role: Role.USER,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw ForbiddenError for unverified user', async () => {
    const user = new User(
      'user-id-123',
      'John',
      'john@example.com',
      "googleId",
      'hashed-password',
      Role.USER,
      false,
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    vi.mocked(comparePassword).mockResolvedValue(true);

    const loginResponse = new LoginUserUseCase(userRepository);
    await expect(
      loginResponse.execute({
        email: 'john@example.com',
        password: 'hashed-password',
        role: Role.USER,
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('should throw UnauthorizedError when user role does not match', async () => {
    const user = new User(
      'user-id-123',
      'John',
      'john@example.com',
      'googleId',
      'hashed-password',
      Role.USER,
      true,
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    vi.mocked(comparePassword).mockResolvedValue(true);
    const loginResponse = new LoginUserUseCase(userRepository);
    await expect(
      loginResponse.execute({
        email: 'john@example.com',
        password: 'hashed-password',
        role: Role.ADMIN,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should login succesfully with valid credentials', async () => {
    const user = new User(
      'user-id-123',
      'John',
      'john@example.com',
      'googleId',
      'hashed-password',
      Role.USER,
      true,
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    vi.mocked(comparePassword).mockResolvedValue(true);

    const loginUserUseCase = new LoginUserUseCase(userRepository);

    const response = await loginUserUseCase.execute({
      email: 'john@example.com',
      password: 'hashed-password',
      role: Role.USER,
    });

    expect(response.user).toBeDefined();
    expect(response.user.id).toBe('user-id-123');
    expect(response.user.name).toBe('John');
    expect(response.user.email).toBe('john@example.com');
    expect(response.user.role).toBe(Role.USER);
  });
});
