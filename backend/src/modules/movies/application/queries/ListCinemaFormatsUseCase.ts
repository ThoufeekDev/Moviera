import { CinemaFormat } from "../../domain/entities/CinemaFormat";
import { ICinemaFormatRepository } from "../../domain/repositories/ICinemaFormatRepository";

export class ListCinemaFormatsUseCase {
  constructor(private readonly repository: ICinemaFormatRepository) {}

  async execute(): Promise<CinemaFormat[]> {
    return await this.repository.findAll();
  }
}
