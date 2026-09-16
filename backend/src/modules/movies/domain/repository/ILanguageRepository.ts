import { Language } from "../entities/Language";

export interface ILanguageRepository {
  findAll(): Promise<Language[]>;

  // ! validating the language while creating or updateing the movie

  findById(id: string): Promise<Language | null>;

  findByIds(ids: string[]):Promise<Language[]>
 
  // !Useful for reference-data/seed logic and potentially internal lookups
  findByCode(code: string): Promise<Language | null>;
}