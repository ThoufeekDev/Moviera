export const MovieStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type MovieStatus = (typeof MovieStatus)[keyof typeof MovieStatus];