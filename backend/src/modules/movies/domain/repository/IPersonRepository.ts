import { Person } from "../entities/Person";


export interface IPersonRepository {
    create(person: Person): Promise<Person>;
    findById(id: string): Promise<Person | null>;
    findByName(name: string): Promise<Person | null>;
    findAll(): Promise<Person[]>
    
    update(id: string, data: {
        name?: string;
        imageUrl?: string | null;
    }):Promise<Person>
}