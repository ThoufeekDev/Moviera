import { Theatre } from "../entities/Theatre"
import type { TheatreOverview } from "../types/TheatreOverView"
import type { TheatreWithCity } from "../types/TheatreWithCity"

export interface ITheatreRepository {
    findById(id: string): Promise<Theatre | null>
    
    findByAdminId(adminId: string): Promise<TheatreWithCity[]>

    findByIdForAdmin(theatreId:string,adminId:string):Promise<Theatre | null>
    
    getOverView(theatreId: string, adminId: string): Promise<TheatreOverview | null>;
}