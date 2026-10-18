import { TheatreFormat } from "../../domain/entities/TheatreFormat";
import { ITheatreFormatRepository } from "../../domain/repositories/ITheatreFormatRepository";

export class ListTheatreFormatsUseCase {
  constructor(private readonly repository: ITheatreFormatRepository) {}

  async execute(): Promise<TheatreFormat[]> {
    return await this.repository.findAll();
  }
}
