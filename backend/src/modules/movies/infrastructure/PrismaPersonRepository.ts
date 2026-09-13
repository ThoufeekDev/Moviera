import prisma from "../../../config/database";
import { Person } from "../domain/entities/Person";
import { IPersonRepository } from "../domain/repository/IPersonRepository";

export class PrismaPersonRepository implements IPersonRepository {
  async create(person: Person): Promise<Person> {
    const createdPerson = await prisma.person.create({
      data: {
        name: person.name,
        imageUrl: person.imageUrl,
      },
    });

    return new Person(createdPerson.id, createdPerson.name, createdPerson.imageUrl);
  }

  async findById(id: string): Promise<Person | null> {
    const person = await prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      return null;
    }

    return new Person(person.id, person.name, person.imageUrl);
  }

  async findByName(name: string): Promise<Person | null> {
    const person = await prisma.person.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!person) return null;

    return new Person(person.id, person.name, person.imageUrl);
  }

  async findAll(): Promise<Person[]> {
    const people = await prisma.person.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return people.map((person) => new Person(person.id, person.name, person.imageUrl));
  }
    
    
    async update(id: string, data: { name?: string; imageUrl?: string | null; }): Promise<Person> {
        const updatedPerson = await prisma.person.update({
            where: { id },
            data,
        })

        return new Person(
            updatedPerson.id,
            updatedPerson.name,
            updatedPerson.imageUrl
        )
    }
}