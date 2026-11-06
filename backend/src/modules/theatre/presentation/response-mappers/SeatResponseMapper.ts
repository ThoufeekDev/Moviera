import type { Seat } from '../../domain/entities/Seat';
import type { SeatType } from '../../domain/enums/SeatType';

export interface SeatResponse {
  id: string;
  screenId: string;
  rowLabel: string;
  seatNumber: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
  type: SeatType;
  isActive: boolean;
}

export class SeatResponseMapper {
  static toResponse(seat: Seat): SeatResponse {
    return {
      id: seat.id,
      screenId: seat.screenId,
      rowLabel: seat.rowLabel,
      seatNumber: seat.seatNumber,
      label: seat.label,
      x: seat.x,
      y: seat.y,
      rotation: seat.rotation,
      type: seat.type,
      isActive: seat.isActive,
    };
  }

  static toListResponse(seats: Seat[]): SeatResponse[] {
    return seats.map(SeatResponseMapper.toResponse);
  }
}

export const toSeatResponse = SeatResponseMapper.toResponse.bind(SeatResponseMapper);
export const toSeatListResponse = SeatResponseMapper.toListResponse.bind(SeatResponseMapper);

