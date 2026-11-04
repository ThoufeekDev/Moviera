import type { Seat } from '../entities/Seat';
import type { CreateSeatProps } from '../types/CreateSeatProps';
import type { SeatType } from '../enums/SeatType';
export interface ISeatRepository {
  findById(id: string): Promise<Seat | null>;

  findByLabel(screenId: string, label: string): Promise<Seat | null>;

  create(data: CreateSeatProps): Promise<Seat>;

  countByScreenId(screenId: string): Promise<number>;

  createManyForEmptyScreen(screenId: string, seats: CreateSeatProps[]): Promise<Seat[] | null>;

  findAllSeatByScreenId(screenId: string): Promise<Seat[]>;

  updateManySeatPositions(
    screenId: string,
    seats: {
      seatId: string;
      x: number;
      y: number;
      rotation: number;
    }[],
  ): Promise<Seat[] | null>;

  updateSeatDetails(
    seatId: string,
    data: {
      type?: SeatType;
      isActive?: boolean;
    },
  ): Promise<Seat | null>;
}
