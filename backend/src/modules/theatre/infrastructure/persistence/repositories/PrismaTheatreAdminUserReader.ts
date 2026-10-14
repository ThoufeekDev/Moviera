import type {
  EligibleAdminUser,
  ITheatreAdminUserReader,
  TheatreAdminUser,
} from '../../../application/ports/ITheatreAdminUserReader';
import { PrismaClient, Role } from '@prisma/client';

export class PrismaTheatreAdminUserReader implements ITheatreAdminUserReader {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(userId: string): Promise<TheatreAdminUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as unknown as TheatreAdminUser['role'],
      isActive: user.isActive,
    };
  }

  async findEligibleAdmins(search?: string): Promise<EligibleAdminUser[]> {
    const where: any = {
      role: Role.THEATRE_ADMIN,
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 50,
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      role: u.role as unknown as EligibleAdminUser['role'],
      isActive: u.isActive,
    }));
  }
}