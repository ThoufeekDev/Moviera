export const ALLOWED_FACILITY_ICON_KEYS = [
  'parking',
  'wheelchair_access',
  'food_court',
  'restrooms',
  'gaming_zone',
  'wifi',
  'air_conditioning',
  'security',
  'lounge',
  'valet',
  'atm',
  'baby_care',
] as const;

export type FacilityIconKey = (typeof ALLOWED_FACILITY_ICON_KEYS)[number];
