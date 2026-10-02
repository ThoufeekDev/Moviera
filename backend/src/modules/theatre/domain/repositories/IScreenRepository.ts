import { Screen } from "../entities/screen.entity";
import { CreateScreenProps } from "../types/CreateScreenProps";

export interface IScreenRepository {
    findById(id: string): Promise<Screen | null>
    
    findByName(theatreId: string,name:string): Promise<Screen | null>
    
    create(screen:CreateScreenProps):Promise<Screen>
}