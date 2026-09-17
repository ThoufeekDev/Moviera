import { IGenreRepository } from "../../domain/repository/IGenreRepository";
import { Genre } from "../../domain/entities/Genre";

export class GetGenresUseCase {
  constructor(
    private readonly genreRepository: IGenreRepository
  ) {}

  async execute(): Promise<Genre[]> {
    return await this.genreRepository.findAll();
  }
}