import api from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  Seat,
  BulkCreateSeatsPayload,
  UpdateSeatLayoutPayload,
  UpdateSeatPropertiesPayload,
  UpdateSeatPayload,
} from '../types/seat.types';

export const getScreenSeatLayout = async (
  screenId: string,
  signal?: AbortSignal,
): Promise<Seat[]> => {
  const response = await api.get<ApiResponse<Seat[]>>(
    `/theatres/screens/${screenId}/seat-layout`,
    { signal },
  );

  return response.data.data;
};

export const bulkCreateSeats = async (
  screenId: string,
  payload: BulkCreateSeatsPayload,
): Promise<Seat[]> => {
  const response = await api.post<ApiResponse<Seat[]>>(
    `/theatres/screens/${screenId}/seats/bulk`,
    payload,
  );

  return response.data.data;
};

export const updateSeatLayout = async (
  screenId: string,
  payload: UpdateSeatLayoutPayload,
): Promise<Seat[]> => {
  const response = await api.patch<ApiResponse<Seat[]>>(
    `/theatres/screens/${screenId}/seat-layout`,
    payload,
  );

  return response.data.data;
};

export const updateSeatProperties = async (
  screenId: string,
  payload: UpdateSeatPropertiesPayload,
): Promise<Seat[]> => {
  const response = await api.patch<ApiResponse<Seat[]>>(
    `/theatres/screens/${screenId}/seats/properties`,
    payload,
  );

  return response.data.data;
};

export const updateSeat = async (
  seatId: string,
  payload: UpdateSeatPayload,
): Promise<Seat> => {
  const response = await api.patch<ApiResponse<Seat>>(
    `/theatres/seats/${seatId}`,
    payload,
  );

  return response.data.data;
};
