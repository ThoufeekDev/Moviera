import { PrismaClient } from '@prisma/client';
import { User, CreateUserData } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserPersistenceMapper } from '../mappers/UserPersistenceMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userData: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        role: UserPersistenceMapper.toPrismaRole(userData.role),
      },
    });

    return UserPersistenceMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return UserPersistenceMapper.toDomain(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        googleId,
      },
    });

    if (!user) {
      return null;
    }

    return UserPersistenceMapper.toDomain(user);
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        googleId,
      },
    });

    return UserPersistenceMapper.toDomain(user);
  }

  async verifyUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return UserPersistenceMapper.toDomain(user);
  }
}
