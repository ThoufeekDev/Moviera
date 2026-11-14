import { SEAT_TYPE_LABELS, type SeatType } from '@/features/theatres';
import { ORDERED_SHOW_SEAT_CATEGORIES } from '../schemas/createShowForm.schema';

export interface ComputedSeatCategoryPrice {
  seatType: SeatType;
  label: string;
  adjustmentRupees: number;
  finalPriceRupees: number;
  adjustmentPaise: number;
  finalPricePaise: number;
  isValid: boolean;
}

export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) return 0;
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  if (!Number.isFinite(paise)) return 0;
  return Math.round(paise) / 100;
}

export function formatRupeesFromPaise(paise: number): string {
  const rupees = paiseToRupees(paise);
  return `₹${Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}`;
}

export function formatRupeesValue(rupees: number): string {
  if (!Number.isFinite(rupees)) return '₹0';
  return `₹${Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}`;
}

export function computeSeatCategoryPrices(
  basePriceRupees: number,
  adjustmentsRupees: Partial<Record<SeatType, number>>,
): ComputedSeatCategoryPrice[] {
  const safeBaseRupees = Number.isFinite(basePriceRupees) ? basePriceRupees : 0;
  const basePaise = rupeesToPaise(safeBaseRupees);

  return ORDERED_SHOW_SEAT_CATEGORIES.map((seatType) => {
    const rawAdjustment = adjustmentsRupees[seatType];
    const adjustmentRupees =
      typeof rawAdjustment === 'number' && Number.isFinite(rawAdjustment)
        ? rawAdjustment
        : 0;
    const adjustmentPaise = rupeesToPaise(adjustmentRupees);
    const finalPricePaise = basePaise + adjustmentPaise;
    const finalPriceRupees = paiseToRupees(finalPricePaise);

    return {
      seatType,
      label: SEAT_TYPE_LABELS[seatType],
      adjustmentRupees,
      finalPriceRupees,
      adjustmentPaise,
      finalPricePaise,
      isValid: finalPricePaise >= 100,
    };
  });
}

export function computeShowPriceRangeRupees(
  basePriceRupees: number,
  adjustmentsRupees: Partial<Record<SeatType, number>>,
): { minRupees: number; maxRupees: number } {
  const categories = computeSeatCategoryPrices(basePriceRupees, adjustmentsRupees);
  if (categories.length === 0) {
    const safe = Number.isFinite(basePriceRupees) ? basePriceRupees : 0;
    return { minRupees: safe, maxRupees: safe };
  }

  let minRupees = categories[0].finalPriceRupees;
  let maxRupees = categories[0].finalPriceRupees;

  for (const item of categories) {
    if (item.finalPriceRupees < minRupees) minRupees = item.finalPriceRupees;
    if (item.finalPriceRupees > maxRupees) maxRupees = item.finalPriceRupees;
  }

  return { minRupees, maxRupees };
}

