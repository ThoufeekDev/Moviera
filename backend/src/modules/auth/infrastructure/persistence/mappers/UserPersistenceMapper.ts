import { Role as PrismaRole } from '@prisma/client';
import { Role } from '../../../../../shared/enums/Role';
import { User } from '../../../domain/entities/User';

export class UserPersistenceMapper {
  static toDomainRole(role: PrismaRole): Role {
    switch (role) {
      case PrismaRole.USER:
        return Role.USER;
      case PrismaRole.THEATRE_ADMIN:
        return Role.THEATRE_ADMIN;
      case PrismaRole.SUPER_ADMIN:
        return Role.SUPER_ADMIN;
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  static toPrismaRole(role: Role): PrismaRole {
    switch (role) {
      case Role.USER:
        return PrismaRole.USER;
      case Role.THEATRE_ADMIN:
        return PrismaRole.THEATRE_ADMIN;
      case Role.SUPER_ADMIN:
        return PrismaRole.SUPER_ADMIN;
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  static toDomain(user: {
    id: string;
    name: string;
    email: string;
    googleId: string | null;
    password: string | null;
    role: PrismaRole;
    isVerified: boolean;
    phone: string | null;
    avatar: string | null;
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
      user.avatar,
      user.gender,
      user.dateOfBirth,
      user.createdAt,
      user.updatedAt,
    );
  }
}
