import { Theatre } from "../entities/Theatre"

export interface ITheatreRepository {
    findById(id:string):Promise<Theatre | null>
}