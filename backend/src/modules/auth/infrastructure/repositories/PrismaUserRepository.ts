import prisma from '../../../../config/database';

import { User, CreateUserData } from '../../domain/entities/User';

import { IUserRepository } from '../../domain/repositories/IUserRepository';

import { Role as PrismaRole } from '@prisma/client';
import { Role } from '../../../../shared/enums/Role';

export class PrismaUserRepository implements IUserRepository {
  private toDomainRole(role: PrismaRole): Role {
    switch (role) {
      case PrismaRole.USER:
        return Role.USER;

      case PrismaRole.ADMIN:
        return Role.ADMIN;

      case PrismaRole.SUPER_ADMIN:
        return Role.SUPER_ADMIN;

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  private toPrismaRole(role: Role): PrismaRole {
    switch (role) {
      case Role.USER:
        return PrismaRole.USER;

      case Role.ADMIN:
        return PrismaRole.ADMIN;

      case Role.SUPER_ADMIN:
        return PrismaRole.SUPER_ADMIN;

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  private toDomainEntity(user: {
    id: string;
    name: string;
    email: string;
    googleId: string | null;
    password: string | null;
    role: PrismaRole;
    isVerified: boolean;
    phone: string | null;
    profileImage: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.googleId,
      user.password,
      this.toDomainRole(user.role),
      user.isVerified,
      user.phone,
      user.profileImage,
      user.gender,
      user.dateOfBirth,
      user.createdAt,
      user.updatedAt,
    );
  }

  async create(userData: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data: {
        ...userData,
        role: this.toPrismaRole(userData.role),
      },
    });

    return this.toDomainEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return this.toDomainEntity(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
      
    const user = await prisma.user.findUnique({
      where: {
        googleId,
      }
    })

    if (!user) return null;

    return this.toDomainEntity(user);
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        googleId
      }
    })

    return this.toDomainEntity(user);
  }

  async verifyUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return this.toDomainEntity(user);
  }
}
