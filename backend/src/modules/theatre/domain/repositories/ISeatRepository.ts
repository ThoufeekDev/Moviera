import type { Seat } from "../entities/Seat";
import type { CreateSeatProps } from "../types/CreateSeatProps";


export interface ISeatRepository{
    findById(id: string): Promise<Seat | null>
    
    findByLabel(screenId: string,label:string): Promise<Seat | null>
    
    create(data:CreateSeatProps):Promise<Seat>
}