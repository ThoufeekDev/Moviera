import { CinemaFormat } from "../entities/CinemaFormat";

export interface ICinemaFormatRepository {
  findAll(): Promise<CinemaFormat[]>;
  findByIds(ids: string[]): Promise<CinemaFormat[]>;
}