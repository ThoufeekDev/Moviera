import { PrismaClient } from "@prisma/client";
import { Person } from "../../../domain/entities/Person";
import { CreatePersonData, IPersonRepository } from "../../../domain/repositories/IPersonRepository";
import { PersonMapper } from "../mappers/PersonMapper";

export class PrismaPersonRepository implements IPersonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePersonData): Promise<Person> {
    const createdPerson = await this.prisma.person.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl ?? null,
        imagePublicId: data.imagePublicId ?? null,
      },
    });

    return PersonMapper.toDomain(createdPerson);
  }

  async findById(id: string): Promise<Person | null> {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    return person ? PersonMapper.toDomain(person) : null;
  }

  async findByIds(ids: string[]): Promise<Person[]> {
    const persons = await this.prisma.person.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return PersonMapper.toDomainList(persons);
  }

  async findByName(name: string): Promise<Person | null> {
    const person = await this.prisma.person.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return person ? PersonMapper.toDomain(person) : null;
  }

  async findAll(): Promise<Person[]> {
    const people = await this.prisma.person.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return PersonMapper.toDomainList(people);
  }
}