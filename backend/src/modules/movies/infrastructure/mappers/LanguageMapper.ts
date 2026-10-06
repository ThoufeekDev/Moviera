import { Language } from "../../domain/entities/Language";

export class LanguageMapper {
  static toDomain(language: {
    id: string;
    name: string;
    code: string;
  }): Language {
    return new Language(
      language.id,
      language.name,
      language.code
    );
  }

  static toDomainList(
    language: {
      id: string;
      name: string;
      code: string;
    }[]
  ): Language[] {
    return language.map((lang) => this.toDomain(lang));
  }
}