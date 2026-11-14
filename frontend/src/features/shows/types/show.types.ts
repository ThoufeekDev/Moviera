import type { SeatType } from '@/features/theatres';
import type { Paginated } from '@/shared/types/apiResponse';

export type ShowStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
export type ShowStatusFilter = 'ALL' | ShowStatus;

export interface ShowResult {
  id: string;
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: ShowStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShowListItem {
  id: string;
  status: ShowStatus;
  startTime: string;
  endTime: string;
  basePrice: number;
  movie: {
    id: string;
    title: string;
    posterUrl: string | null;
    duration: number;
    languages: string[];
    certification: string;
  };
  screen: {
    id: string;
    name: string;
    totalSeats: number;
  };
  theatre: {
    id: string;
    name: string;
    cityName: string;
  };
  cinemaFormat: {
    id: string;
    name: string;
    slug: string;
  };
  seatSummary: {
    totalSeats: number;
    availableSeats: number;
    bookedSeats: number;
  };
  createdAt: string;
  updatedAt: string;
}

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
  startTime: string;
  endTime: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface GetShowsParams {
  search?: string;
  status?: ShowStatusFilter;
  theatreId?: string;
  screenId?: string;
  movieId?: string;
  cinemaFormatId?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export type GetShowsResponseData = Paginated<ShowListItem>;

export interface CreateShowPayload {
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: string;
  endTime?: string;
  basePrice: number;
  priceAdjustments?: Partial<Record<SeatType, number>>;
}

export interface UpdateShowPayload {
  movieId?: string;
  cinemaFormatId?: string;
  startTime?: string;
  endTime?: string;
  basePrice?: number;
  priceAdjustments?: Partial<Record<SeatType, number>>;
}

