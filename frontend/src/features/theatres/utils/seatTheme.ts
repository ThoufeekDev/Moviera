import type { SeatType } from '../types/seat.types';

/**
 * Colours for the seat editor canvas. Tweak selection / hover / tier colours here.
 */

/** Converts a #RRGGBB colour to an rgba() string with the given alpha (0-1). */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const TIER_COLORS: Record<SeatType, { name: string; color: string }> = {
  REGULAR: { name: 'Regular', color: '#1EA83C' },
  PREMIUM: { name: 'Premium', color: '#2563EB' },
  RECLINER: { name: 'Recliner', color: '#D97706' },
  SOFA: { name: 'Sofa', color: '#7C3AED' },
  WHEELCHAIR: { name: 'Wheelchair', color: '#0D9488' },
};

export const SEAT_THEME = {
  available: { fill: '#FFFFFF', strokeWidth: 1.2 },
  inactive: { fill: '#E2E8F0', stroke: '#CBD5E1', text: '#94A3B8', selectedStroke: '#64748B' },
  /** Tier colour at this alpha is the fill of a hovered seat. */
  hoverFillAlpha: 0.08,
  /** Selected seat: light tier tint, 2px tier border, bold tier number, subtle glow. */
  selected: {
    fillAlpha: 0.18,
    strokeWidth: 2,
    glowBlur: 4,
    glowOpacity: 0.2,
  },
} as const;

export const SELECTION_THEME = {
  marquee: {
    fill: 'rgba(100, 116, 139, 0.08)',
    stroke: 'rgba(100, 116, 139, 0.6)',
    strokeWidth: 1,
    dash: [4, 3],
  },
  selectionBox: {
    fill: 'rgba(100, 116, 139, 0.05)',
    stroke: 'rgba(100, 116, 139, 0.7)',
    strokeWidth: 1,
    dash: [4, 3],
    padding: 6,
  },
  ghost: {
    fill: 'rgba(59, 130, 246, 0.08)',
    stroke: '#3B82F6',
    strokeWidth: 1.5,
    dash: [4, 3],
  },
  conflictGhost: {
    fill: 'rgba(239, 68, 68, 0.16)',
    stroke: '#EF4444',
    strokeWidth: 1.8,
    dash: [4, 2],
  },
} as const;

