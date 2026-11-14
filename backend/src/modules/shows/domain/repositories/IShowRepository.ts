import type { Show } from '../entities/Show';
import type { CreateShowData } from '../types/CreateShowData';
import type { UpdateShowData } from '../types/UpdateShowData';

export interface CheckScheduleConflictParams {
  screenId: string;
  startTime: Date;
  endTime: Date;
  cleaningBufferMinutes: number;
  excludeShowId?: string;
}

export interface ShowSeatInventorySummary {
  totalSeats: number;
  minPrice: number;
}

export interface IShowRepository {
  findById(showId: string): Promise<Show | null>;
  hasSchedulingConflict?(params: CheckScheduleConflictParams): Promise<boolean>;
  getSeatInventorySummary(showId: string): Promise<ShowSeatInventorySummary>;
  countActiveBookings(showId: string): Promise<number>;
  countBookings(showId: string): Promise<number>;
  create(show: CreateShowData): Promise<Show>;
  publish(show: Show, cleaningBufferMinutes: number): Promise<Show>;
  cancel(show: Show): Promise<Show>;
  update(data: UpdateShowData): Promise<Show>;
}
