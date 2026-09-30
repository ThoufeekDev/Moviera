import type { SeatType } from "../enums/SeatType";

export interface CreateSeatProps {
  screenId: string;
  rowLabel: string;
  seatNumber: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
  type: SeatType;
}