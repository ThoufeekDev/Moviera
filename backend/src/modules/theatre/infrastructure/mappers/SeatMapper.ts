import { Seat } from "../../domain/entities/seat.entity";

import type { SeatProps } from '../../domain/types/SeatProps';



export class SeatMapper {
    

    static toDomain(data: SeatProps):Seat {
        return Seat.create(data);
    }
}