import { Theatre } from "../../domain/entities/Theatre";
import prisma from "../../../../config/database";

import { ITheatreRepository } from "../../domain/repositories/ITheatreRepository";
import { TheatreMapper } from "../mappers/TheatreMapper";


export class PrismaTheatreRepository implements ITheatreRepository  {
  


    async findById(id: string): Promise<Theatre | null> {
        const theatre = await prisma.theatre.findUnique({
            where: {
                id
            }
        })

        return theatre?TheatreMapper.toDomain(theatre):null
    }
}