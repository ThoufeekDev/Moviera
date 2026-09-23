import prisma from "../../../../config/database";
import { CinemaFormat } from "../../domain/entities/CinemaFormat";
import { ICinemaFormatRepository } from "../../domain/repository/ICinemaFormatRepository";


export class PrismaCinemaFormatRepository
  implements ICinemaFormatRepository
{
 

  async findAll(): Promise<CinemaFormat[]> {
    return prisma.cinemaFormat.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findByIds(ids: string[]): Promise<CinemaFormat[]> {
    return prisma.cinemaFormat.findMany({
      where: {
        id: {
          in: ids,
        },
        isActive: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<CinemaFormat | null> {
    return prisma.cinemaFormat.findFirst({
      where: {
        slug,
        isActive: true,
      },
    });
  }
}