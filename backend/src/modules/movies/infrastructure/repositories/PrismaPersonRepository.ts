import prisma from "../../../../config/database";
import { Person } from "../../domain/entities/Person";
import { IPersonRepository } from "../../domain/repositories/IPersonRepository";
import { PersonMapper } from "../mappers/PersonMapper";

export class PrismaPersonRepository implements IPersonRepository {
  async create(person: Person): Promise<Person> {
    const createdPerson = await prisma.person.create({
      data: {
        name: person.name,
        imageUrl: person.imageUrl,
      },
    });

  

    return PersonMapper.toDomain(createdPerson)
  }

  async findById(id: string): Promise<Person | null> {
    const person = await prisma.person.findUnique({
      where: { id },
    });


    return person?PersonMapper.toDomain(person):null
  }

async findByIds(ids: string[]): Promise<Person[]> {
  const persons = await prisma.person.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });


  return PersonMapper.toDomainList(persons);
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

  

  
     return person ? PersonMapper.toDomain(person) : null;
  }

  async findAll(): Promise<Person[]> {
    const people = await prisma.person.findMany({
      orderBy: {
        name: 'asc',
      },
    });

   
    return PersonMapper.toDomainList(people);
  }
    
    
    async update(id: string, data: { name?: string; imageUrl?: string | null; }): Promise<Person> {
        const updatedPerson = await prisma.person.update({
            where: { id },
            data,
        })


      
       return PersonMapper.toDomain(updatedPerson);
    }
}