import { Person } from '../../domain/entities/Person';

export interface PersonResponse {
  id: string;
  name: string;
  imageUrl: string | null;
}

export class PersonResponseMapper {
  static toResponse(person: Person): PersonResponse {
    return {
      id: person.id,
      name: person.name,
      imageUrl: person.imageUrl,
    };
  }

  static toListResponse(people: Person[]): PersonResponse[] {
    return people.map((person) => PersonResponseMapper.toResponse(person));
  }
}

export const toResponse = PersonResponseMapper.toResponse.bind(PersonResponseMapper);
export const toListResponse = PersonResponseMapper.toListResponse.bind(PersonResponseMapper);
