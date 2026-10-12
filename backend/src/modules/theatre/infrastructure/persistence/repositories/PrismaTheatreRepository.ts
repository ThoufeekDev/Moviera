import { PrismaClient } from '@prisma/client';
import { Theatre } from '../../../domain/entities/Theatre';
import { ITheatreRepository } from '../../../domain/repositories/ITheatreRepository';
import { TheatreMapper } from '../mappers/TheatreMapper';

export class PrismaTheatreRepository implements ITheatreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Theatre | null> {
    const theatre = await this.prisma.theatre.findUnique({
      where: {
        id,
      },
    });

    return theatre ? TheatreMapper.toDomain(theatre) : null;
  }

  async findByIdForAdmin(theatreId: string, adminId: string): Promise<Theatre | null> {
    const assignment = await this.prisma.theatreAdminAssignment.findFirst({
      where: {
        theatreId,
        userId: adminId,
        isActive: true,
        theatre: {
          isActive: true,
        },
      },
      include: {
        theatre: true,
      },
    });

    return assignment ? TheatreMapper.toDomain(assignment.theatre) : null;
  }
}
