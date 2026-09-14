import { ILanguageRepository } from "../../domain/repository/ILanguageRepository";
import { Language } from "../../domain/entities/Language";


export class GetLanugageUseCase {
    constructor(private readonly repository: ILanguageRepository) { }
    

    async execute():Promise<Language[]> {
          return await this.repository.findAll();

        
    }
}