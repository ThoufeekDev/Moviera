import { IGenreRepository } from "../../domain/repository/IGenreRepository";
import prisma from "../../../../config/database";
import { Genre } from "../../domain/entities/Genre";
export class PrismaGenreRepository implements IGenreRepository{

   async findAll():Promise<Genre[]> {
        return await prisma.genre.findMany({
            where: {
                isActive:true
            },
            orderBy: {
                name:"asc"
            }
        })
   }
    
    async findById(id: string): Promise<Genre | null> {
        return prisma.genre.findUnique({
            where: {
                id,
                isActive:true
              }
          })
    }

    async findBySlug(slug: string): Promise<Genre | null> {
        return prisma.genre.findUnique({
            where: {
                slug,
                isActive:true
             }
         })
    }
}