import type { SeatType } from '../../../theatre';
import type { ShowStatus } from '../../domain/enums/ShowStatus';

export interface ShowSeatTierPricing {
  seatType: SeatType;
  priceAdjustment: number;
  finalPrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export interface ShowDetail {
  id: string;
  status: ShowStatus;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  movie: {
    id: string;
    title: string;
    posterUrl: string | null;
    duration: number;
    languages: string[];
    certification: string;
    isActive: boolean;
  };
  screen: {
    id: string;
    name: string;
    totalSeats: number;
    isActive: boolean;
  };
  theatre: {
    id: string;
    name: string;
    cityName: string;
    cleaningBufferMinutes: number;
    isActive: boolean;
  };
  cinemaFormat: {
    id: string;
    name: string;
    slug: string;
  };
  pricing: {
    basePrice: number;
    minPrice: number;
    maxPrice: number;
    tiers: ShowSeatTierPricing[];
  };
  seatInventorySummary: {
    totalSeats: number;
    availableSeats: number;
    bookedSeats: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
