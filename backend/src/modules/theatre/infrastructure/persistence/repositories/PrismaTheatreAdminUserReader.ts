import type {
    ITheatreAdminUserReader,
    TheatreAdminUser
} from "../../../application/ports/ITheatreAdminUserReader"
import { PrismaClient } from "@prisma/client"

export class PrismaTheatreAdminUserReader
  implements ITheatreAdminUserReader
{
  constructor(private readonly prisma: PrismaClient) {}


async findById(userId: string): Promise<TheatreAdminUser | null> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    role: user.role as TheatreAdminUser['role'],
    isActive: user.isActive,
  };
}

}