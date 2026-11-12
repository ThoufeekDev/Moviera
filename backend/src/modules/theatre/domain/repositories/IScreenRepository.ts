import { Screen } from '../entities/Screen';
import { CreateScreenProps } from '../types/CreateScreenProps';
import { CreateSeatProps } from '../types/CreateSeatProps';
import { Seat } from '../entities/Seat';
export interface IScreenRepository {
  findById(id: string): Promise<Screen | null>;

  findByName(theatreId: string, name: string): Promise<Screen | null>;

  findBySlug(theatreId: string, slug: string): Promise<Screen | null>;

  findActiveCinemaFormatIds?(ids: string[]): Promise<string[]>;

  create(screen: CreateScreenProps): Promise<Screen>;
}
