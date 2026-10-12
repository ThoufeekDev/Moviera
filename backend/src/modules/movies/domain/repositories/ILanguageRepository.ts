import { Language } from "../entities/Language";

export interface ILanguageRepository {
  findAll(): Promise<Language[]>;
  findByIds(ids: string[]): Promise<Language[]>;
}