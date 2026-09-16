export const Role = {
  THEATRE_ADMIN: 'THEATRE_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
