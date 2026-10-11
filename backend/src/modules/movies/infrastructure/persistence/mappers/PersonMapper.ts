import { Person } from "../../../domain/entities/Person";

export class PersonMapper {
  static toDomain(data: {
    id: string;
    name: string;
    imageUrl: string | null;
    imagePublicId?: string | null;
  }): Person {
    return new Person(
      data.id,
      data.name,
      data.imageUrl,
      data.imagePublicId ?? null,
    );
  }

  static toDomainList(
    data: {
      id: string;
      name: string;
      imageUrl: string | null;
      imagePublicId?: string | null;
    }[]
  ): Person[] {
    return data.map((person) => this.toDomain(person));
  }
}