import { Person } from "../entities/Person";

export interface CreatePersonData {
  name: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
}

export interface IPersonRepository {
  create(data: CreatePersonData): Promise<Person>;
  findById(id: string): Promise<Person | null>;
  findByIds(ids: string[]): Promise<Person[]>;
  findByName(name: string): Promise<Person | null>;
  findAll(): Promise<Person[]>;
}