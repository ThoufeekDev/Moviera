import { SeatType } from "../enums/SeatType";

export interface SeatProps {
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
  createdAt: Date;
  updatedAt: Date;
}