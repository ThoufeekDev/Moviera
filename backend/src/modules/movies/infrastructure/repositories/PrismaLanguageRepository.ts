import prisma from '../../../../config/database';
import { Language } from '../../domain/entities/Language';
import { ILanguageRepository } from '../../domain/repositories/ILanguageRepository';
import { LanguageMapper } from '../mappers/LanguageMapper';

export class PrismaLanguageRepository implements ILanguageRepository {


  async findAll(): Promise<Language[]> {
    const languages = await prisma.language.findMany({
      orderBy: {
        name: 'asc',
      },
    });


    return LanguageMapper.toDomainList(languages);
  }

  async findById(id: string): Promise<Language | null> {
    const language = await prisma.language.findUnique({
      where: {
        id,
      },
    });

    

   

    return language ? LanguageMapper.toDomain(language) : null;
  }

 async findByIds(ids: string[]): Promise<Language[]> {
    const languages = await prisma.language.findMany({
      where: {
        id: {
            in:ids
        },
       
        }
    })
    
  
    return LanguageMapper.toDomainList(languages);
   
  }

  async findByCode(code: string): Promise<Language | null> {
    const language = await prisma.language.findUnique({
      where: {
        code,
      },
    });

   

        return language
      ? LanguageMapper.toDomain(language)
      : null;
  }
}
