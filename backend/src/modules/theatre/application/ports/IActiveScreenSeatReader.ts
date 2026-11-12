import type { SeatType } from '../../domain/enums/SeatType';

export interface ActiveScreenSeat {
  id: string;
  type: SeatType;
}

export interface IActiveScreenSeatReader {
  findActiveByScreenId(screenId: string): Promise<ActiveScreenSeat[]>;
}