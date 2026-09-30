export const SeatType = {
  REGULAR: 'REGULAR',
  PREMIUM: 'PREMIUM',
  RECLINER: 'RECLINER',
  WHEELCHAIR: 'WHEELCHAIR',
  SOFA: 'SOFA',
} as const;

export type SeatType = (typeof SeatType)[keyof typeof SeatType];