import type { SeatType } from '../../domain/enums/SeatType';

export interface CreateSeatDTO {
  rowLabel: string;
  seatNumber: number;
  x: number;
  y: number;
  rotation?: number;
  type: SeatType;
}