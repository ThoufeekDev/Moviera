export const SEAT_TYPES = [
  'REGULAR',
  'PREMIUM',
  'RECLINER',
  'WHEELCHAIR',
  'SOFA',
] as const;

export type SeatType = (typeof SEAT_TYPES)[number];

export const SEAT_TYPE_LABELS: Record<SeatType, string> = {
  REGULAR: 'Regular',
  PREMIUM: 'Premium',
  RECLINER: 'Recliner',
  WHEELCHAIR: 'Wheelchair',
  SOFA: 'Sofa',
};

export interface Seat {
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
}

export interface BulkCreateSeatsRow {
  rowLabel: string;
  seatCount: number;
  type: SeatType;
  rotation?: number;
}

export interface BulkCreateSeatsPayload {
  rows: BulkCreateSeatsRow[];
}

export interface UpdateSeatLayoutItem {
  seatId: string;
  x: number;
  y: number;
  rotation: number;
}

export interface UpdateSeatPropertiesItem {
  seatId: string;
  type?: SeatType;
  isActive?: boolean;
}

export interface UpdateSeatLayoutPayload {
  seats: UpdateSeatLayoutItem[];
}

export interface UpdateSeatPropertiesPayload {
  seats: UpdateSeatPropertiesItem[];
}

export interface UpdateSeatPayload {
  type?: SeatType;
  isActive?: boolean;
}
