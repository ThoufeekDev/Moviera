import { Genre } from '../entities/Genre';

export interface IGenreRepository {
  findAll(): Promise<Genre[]>;
  findByIds(ids: string[]): Promise<Genre[]>;
}