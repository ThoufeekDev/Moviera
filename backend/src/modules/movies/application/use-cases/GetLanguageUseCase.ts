import { ILanguageRepository } from "../../domain/repositories/ILanguageRepository";
import { Language } from "../../domain/entities/Language";


export class GetLanguageUseCase {
    constructor(private readonly repository: ILanguageRepository) { }
    

    async execute():Promise<Language[]> {
          return await this.repository.findAll();

        
    }
}