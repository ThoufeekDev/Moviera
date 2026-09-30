import { Seat } from "../../domain/entities/Seat";

import type { SeatProps } from '../../domain/types/SeatProps';



export class SeatMapper {
    

    static toDomain(data: SeatProps):Seat {
        return Seat.create(data);
    }
}