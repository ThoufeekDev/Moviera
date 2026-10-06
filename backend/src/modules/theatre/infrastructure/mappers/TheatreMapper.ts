import { Theatre } from "../../domain/entities/Theatre";
import { TheatreProps } from "../../domain/types/TheatreProps";


export class TheatreMapper {
    
    static toDomain(data: TheatreProps) {
          return Theatre.create(data)
     }
}