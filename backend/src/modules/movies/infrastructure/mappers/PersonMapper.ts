import { Person } from "../../domain/entities/Person";

export class PersonMapper {
  static toDomain(data: {
    id: string;
    name: string;
    imageUrl: string | null;
  }): Person {
    return new Person(
      data.id,
      data.name,
      data.imageUrl
    );
  }

  static toDomainList(
    data: {
      id: string;
      name: string;
      imageUrl: string | null;
    }[]
  ): Person[] {
    return data.map((person) => this.toDomain(person));
  }
}