import { TheatreFormat } from "../entities/TheatreFormat";

export interface ITheatreFormatRepository {
  findAll(): Promise<TheatreFormat[]>;
  findByIds(ids: string[]): Promise<TheatreFormat[]>;
}