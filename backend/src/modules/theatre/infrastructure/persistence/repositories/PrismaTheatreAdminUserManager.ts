import { PrismaClient, Role } from '@prisma/client';
import {
  ITheatreAdminUserManager,
  TheatreAdminUserSummary,
} from '../../../application/ports/ITheatreAdminUserManager';

export class PrismaTheatreAdminUserManager implements ITheatreAdminUserManager {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<TheatreAdminUserSummary | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async createTheatreAdmin(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
  }): Promise<TheatreAdminUserSummary> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        password: data.passwordHash,
        role: Role.THEATRE_ADMIN,
        isVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async promoteToTheatreAdmin(
    userId: string,
    data?: { passwordHash?: string; phone?: string; name?: string },
  ): Promise<TheatreAdminUserSummary> {
    const updatePayload: Record<string, unknown> = {
      role: Role.THEATRE_ADMIN,
      isActive: true,
      isVerified: true,
    };

    if (data?.passwordHash) {
      updatePayload.password = data.passwordHash;
    }
    if (data?.phone) {
      updatePayload.phone = data.phone.trim();
    }
    if (data?.name) {
      updatePayload.name = data.name.trim();
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      isActive: updated.isActive,
    };
  }
}
