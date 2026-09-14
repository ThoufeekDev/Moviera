import prisma from '../../../../config/database';
import { Language } from '../../domain/entities/Language';
import { ILanguageRepository } from '../../domain/repository/ILanguageRepository';

export class PrismaLanugageRepository implements ILanguageRepository {
//   constructor(private readonly prisma:Prisma) {}

  async findAll(): Promise<Language[]> {
    const languages = await prisma.language.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return languages.map((language) => new Language(language.id, language.name, language.code));
  }

  async findById(id: string): Promise<Language | null> {
    const languageById = await prisma.language.findUnique({
      where: {
        id,
      },
    });

    if (!languageById) return null;

    return new Language(languageById.id, languageById.name, languageById.code);
  }

  async findByCode(code: string): Promise<Language | null> {
    const languagByCode = await prisma.language.findUnique({
      where: {
        code,
      },
    });

    if (!languagByCode) return null;

    return new Language(languagByCode.id, languagByCode.name, languagByCode.code);
  }
}
