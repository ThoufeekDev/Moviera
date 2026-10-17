import type { FC, SVGProps } from 'react';
import {
  SquareParking,
  Accessibility,
  Utensils,
  Bath,
  Gamepad2,
  Wifi,
  AirVent,
  ShieldCheck,
  Armchair,
  KeyRound,
  Banknote,
  Baby,
  Layers,
  type LucideProps,
} from 'lucide-react';

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

export const isFacilityIconKey = (key: string): key is FacilityIconKey => {
  return (ALLOWED_FACILITY_ICON_KEYS as readonly string[]).includes(key);
};

export const FACILITY_ICON_REGISTRY: Record<
  FacilityIconKey,
  FC<SVGProps<SVGSVGElement> & LucideProps>
> = {
  parking: SquareParking,
  wheelchair_access: Accessibility,
  food_court: Utensils,
  restrooms: Bath,
  gaming_zone: Gamepad2,
  wifi: Wifi,
  air_conditioning: AirVent,
  security: ShieldCheck,
  lounge: Armchair,
  valet: KeyRound,
  atm: Banknote,
  baby_care: Baby,
};

export const FACILITY_ICON_LABELS: Record<FacilityIconKey, string> = {
  parking: 'Parking',
  wheelchair_access: 'Wheelchair Access',
  food_court: 'Food Court',
  restrooms: 'Restrooms',
  gaming_zone: 'Gaming Zone',
  wifi: 'Wi-Fi',
  air_conditioning: 'Air Conditioning',
  security: 'Security',
  lounge: 'VIP Lounge',
  valet: 'Valet Parking',
  atm: 'ATM',
  baby_care: 'Baby Care',
};

export interface FacilityIconProps {
  iconKey?: string | null;
  className?: string;
  size?: number;
  'aria-label'?: string;
}

export function FacilityIcon({
  iconKey,
  className,
  size = 20,
  'aria-label': ariaLabel,
}: FacilityIconProps) {
  const IconComponent =
    (iconKey && isFacilityIconKey(iconKey)
      ? FACILITY_ICON_REGISTRY[iconKey]
      : null) ?? Layers;

  return (
    <IconComponent
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
}

export default FacilityIcon;
