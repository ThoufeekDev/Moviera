import { PrismaClient } from '@prisma/client';
import { Language } from '../../../domain/entities/Language';
import { ILanguageRepository } from '../../../domain/repositories/ILanguageRepository';
import { LanguageMapper } from '../mappers/LanguageMapper';

export class PrismaLanguageRepository implements ILanguageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Language[]> {
    const languages = await this.prisma.language.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return LanguageMapper.toDomainList(languages);
  }

  async findByIds(ids: string[]): Promise<Language[]> {
    const languages = await this.prisma.language.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return LanguageMapper.toDomainList(languages);
  }
}
