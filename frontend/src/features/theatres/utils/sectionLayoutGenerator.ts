import type { BulkCreateSeatsRow, Seat, SeatType } from '../types/seat.types';
import {
  BLOCK_ORIGIN,
  SEAT_METRICS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './seatMetrics';

// Seat geometry is defined once in SEAT_METRICS (seatMetrics.ts)
export const SEAT_WIDTH = SEAT_METRICS.width;
export const SEAT_HEIGHT = SEAT_METRICS.height;
export const SEAT_PITCH_X = SEAT_METRICS.pitchX; // 30px
export const SEAT_PITCH_Y = SEAT_METRICS.pitchY; // 28px
export const SEAT_GAP_X = SEAT_PITCH_X - SEAT_WIDTH; // 2px horizontal gap
export const SEAT_GAP_Y = SEAT_PITCH_Y - SEAT_HEIGHT; // 4px vertical gap

// Aisles are whole empty seat slots so that every seat stays on the pitch grid
export const AISLE_WIDTH_DEFAULT = SEAT_PITCH_X * 2 + SEAT_GAP_X; // two empty seat slots
export const CROSS_AISLE_HEIGHT_DEFAULT = SEAT_PITCH_Y; // one empty row slot

export interface LayoutSection {
  id: string;
  name: string;
  defaultSeatCount: number;
}

export interface LayoutRowConfig {
  id: string;
  rowLabel: string;
  type: SeatType;
  sectionSeats: Record<string, number>; // sectionId -> count (0 = empty)
  hasHorizontalAisleAfter?: boolean;
}

export type LayoutRow = LayoutRowConfig;

export interface SectionLayoutConfig {
  sections: LayoutSection[];
  rows: LayoutRowConfig[];
  verticalAisleSpacing?: number;
  horizontalAisleSpacing?: number;
}

// Simple Layout Presets
export const SIMPLE_PRESETS: Record<
  string,
  { label: string; description: string; rows: BulkCreateSeatsRow[] }
> = {
  CLASSIC_HALL: {
    label: 'Standard Hall',
    description: '6 rows of 12 seats (72 seats)',
    rows: [
      { rowLabel: 'A', seatCount: 12, type: 'PREMIUM' },
      { rowLabel: 'B', seatCount: 12, type: 'PREMIUM' },
      { rowLabel: 'C', seatCount: 12, type: 'REGULAR' },
      { rowLabel: 'D', seatCount: 12, type: 'REGULAR' },
      { rowLabel: 'E', seatCount: 12, type: 'REGULAR' },
      { rowLabel: 'F', seatCount: 12, type: 'REGULAR' },
    ],
  },
  MULTIPLEX: {
    label: 'Multiplex Tiered',
    description: '2 Sofa, 4 Premium, 2 Regular (96 seats)',
    rows: [
      { rowLabel: 'A', seatCount: 10, type: 'SOFA' },
      { rowLabel: 'B', seatCount: 10, type: 'SOFA' },
      { rowLabel: 'C', seatCount: 12, type: 'PREMIUM' },
      { rowLabel: 'D', seatCount: 12, type: 'PREMIUM' },
      { rowLabel: 'E', seatCount: 12, type: 'PREMIUM' },
      { rowLabel: 'F', seatCount: 12, type: 'PREMIUM' },
      { rowLabel: 'G', seatCount: 14, type: 'REGULAR' },
      { rowLabel: 'H', seatCount: 14, type: 'REGULAR' },
    ],
  },
  RECLINER: {
    label: 'Luxury Recliner',
    description: '4 rows of 8 recliners (32 seats)',
    rows: [
      { rowLabel: 'A', seatCount: 8, type: 'RECLINER' },
      { rowLabel: 'B', seatCount: 8, type: 'RECLINER' },
      { rowLabel: 'C', seatCount: 8, type: 'RECLINER' },
      { rowLabel: 'D', seatCount: 8, type: 'RECLINER' },
    ],
  },
};

// Multi-Section Layout Presets
export const MULTI_SECTION_PRESETS: Record<
  string,
  {
    label: string;
    description: string;
    sections: LayoutSection[];
    rows: LayoutRowConfig[];
  }
> = {
  BMS_4_SECTION: {
    label: 'BookMyShow 4-Section (7-9-9-7)',
    description: '18 rows, Left (7), Mid-Left (9), Mid-Right (9), Right (7) with cross-aisles',
    sections: [
      { id: 's-left', name: 'Left', defaultSeatCount: 7 },
      { id: 's-mleft', name: 'Mid-Left', defaultSeatCount: 9 },
      { id: 's-mright', name: 'Mid-Right', defaultSeatCount: 9 },
      { id: 's-right', name: 'Right', defaultSeatCount: 7 },
    ],
    rows: [
      { id: 'bms-SA', rowLabel: 'SA', type: 'RECLINER', sectionSeats: { 's-left': 6, 's-mleft': 8, 's-mright': 8, 's-right': 6 } },
      { id: 'bms-SB', rowLabel: 'SB', type: 'RECLINER', sectionSeats: { 's-left': 6, 's-mleft': 8, 's-mright': 8, 's-right': 6 }, hasHorizontalAisleAfter: true },
      { id: 'bms-A', rowLabel: 'A', type: 'PREMIUM', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-B', rowLabel: 'B', type: 'PREMIUM', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-C', rowLabel: 'C', type: 'PREMIUM', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-D', rowLabel: 'D', type: 'PREMIUM', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-E', rowLabel: 'E', type: 'PREMIUM', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-F', rowLabel: 'F', type: 'PREMIUM', sectionSeats: { 's-left': 6, 's-mleft': 8, 's-mright': 8, 's-right': 6 }, hasHorizontalAisleAfter: true },
      { id: 'bms-G', rowLabel: 'G', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-H', rowLabel: 'H', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-I', rowLabel: 'I', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-J', rowLabel: 'J', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-K', rowLabel: 'K', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-L', rowLabel: 'L', type: 'REGULAR', sectionSeats: { 's-left': 5, 's-mleft': 8, 's-mright': 8, 's-right': 5 }, hasHorizontalAisleAfter: true },
      { id: 'bms-M', rowLabel: 'M', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-N', rowLabel: 'N', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-O', rowLabel: 'O', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-P', rowLabel: 'P', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-Q', rowLabel: 'Q', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
      { id: 'bms-R', rowLabel: 'R', type: 'REGULAR', sectionSeats: { 's-left': 7, 's-mleft': 9, 's-mright': 9, 's-right': 7 } },
    ],
  },
  BMS_TRIPLE: {
    label: 'BookMyShow Classic Triple',
    description: 'Left (7), Centre (14), Right (7) with Cross-Aisle',
    sections: [
      { id: 'left', name: 'Left', defaultSeatCount: 7 },
      { id: 'centre', name: 'Centre', defaultSeatCount: 14 },
      { id: 'right', name: 'Right', defaultSeatCount: 7 },
    ],
    rows: [
      {
        id: 'r-A',
        rowLabel: 'A',
        type: 'PREMIUM',
        sectionSeats: { left: 7, centre: 14, right: 7 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'r-B',
        rowLabel: 'B',
        type: 'PREMIUM',
        sectionSeats: { left: 7, centre: 14, right: 7 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'r-C',
        rowLabel: 'C',
        type: 'PREMIUM',
        sectionSeats: { left: 7, centre: 14, right: 7 },
        hasHorizontalAisleAfter: true, // Cross-way walking aisle
      },
      {
        id: 'r-D',
        rowLabel: 'D',
        type: 'REGULAR',
        sectionSeats: { left: 7, centre: 14, right: 7 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'r-E',
        rowLabel: 'E',
        type: 'REGULAR',
        sectionSeats: { left: 6, centre: 12, right: 6 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'r-F',
        rowLabel: 'F',
        type: 'REGULAR',
        sectionSeats: { left: 6, centre: 12, right: 6 },
        hasHorizontalAisleAfter: false,
      },
    ],
  },
  GRAND_4_SECTION: {
    label: 'Grand 4-Section Multiplex',
    description: 'Left (5), Mid-Left (8), Mid-Right (8), Right (5)',
    sections: [
      { id: 's-left', name: 'Left', defaultSeatCount: 5 },
      { id: 's-mleft', name: 'Mid-Left', defaultSeatCount: 8 },
      { id: 's-mright', name: 'Mid-Right', defaultSeatCount: 8 },
      { id: 's-right', name: 'Right', defaultSeatCount: 5 },
    ],
    rows: [
      {
        id: 'g-A',
        rowLabel: 'A',
        type: 'SOFA',
        sectionSeats: { 's-left': 4, 's-mleft': 6, 's-mright': 6, 's-right': 4 },
        hasHorizontalAisleAfter: true,
      },
      {
        id: 'g-B',
        rowLabel: 'B',
        type: 'PREMIUM',
        sectionSeats: { 's-left': 5, 's-mleft': 8, 's-mright': 8, 's-right': 5 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'g-C',
        rowLabel: 'C',
        type: 'PREMIUM',
        sectionSeats: { 's-left': 5, 's-mleft': 8, 's-mright': 8, 's-right': 5 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'g-D',
        rowLabel: 'D',
        type: 'REGULAR',
        sectionSeats: { 's-left': 5, 's-mleft': 8, 's-mright': 8, 's-right': 5 },
        hasHorizontalAisleAfter: false,
      },
    ],
  },
  LUXURY_CLUB: {
    label: 'VIP Club Lounge',
    description: 'Left Recliners (4), Centre Sofas (8), Right Recliners (4)',
    sections: [
      { id: 'v-left', name: 'Left Recliner', defaultSeatCount: 4 },
      { id: 'v-centre', name: 'Centre Sofa', defaultSeatCount: 8 },
      { id: 'v-right', name: 'Right Recliner', defaultSeatCount: 4 },
    ],
    rows: [
      {
        id: 'v-A',
        rowLabel: 'A',
        type: 'RECLINER',
        sectionSeats: { 'v-left': 4, 'v-centre': 8, 'v-right': 4 },
        hasHorizontalAisleAfter: false,
      },
      {
        id: 'v-B',
        rowLabel: 'B',
        type: 'RECLINER',
        sectionSeats: { 'v-left': 4, 'v-centre': 8, 'v-right': 4 },
        hasHorizontalAisleAfter: true,
      },
      {
        id: 'v-C',
        rowLabel: 'C',
        type: 'SOFA',
        sectionSeats: { 'v-left': 4, 'v-centre': 8, 'v-right': 4 },
        hasHorizontalAisleAfter: false,
      },
    ],
  },
};

export interface CalculatedSeatPosition {
  seatId?: string;
  rowLabel: string;
  seatNumber: number;
  type: SeatType;
  sectionId?: string;
  sectionIndex: number;
  // Pixel positions relative to the top-left of the generated block
  pixelX: number;
  pixelY: number;
  // Normalized [0, 1] positions relative to the block extent (used by the live preview only)
  x: number;
  y: number;
  // Normalized [0, 1] positions in the fixed world mapping (what gets persisted)
  nx: number;
  ny: number;
}

export interface RowMetadata {
  rowLabel: string;
  type: SeatType;
  avgY: number;
  minX: number;
  maxX: number;
  seats: Seat[];
  hasAisleAfter: boolean; // True if next row has an expanded cross-aisle gap
  hasOrderMismatch?: boolean; // True if seat x-order doesn't match seatNumber order
  sections?: Seat[][]; // Groupings of seats separated by horizontal gaps > 1.5 seat widths
}

export interface TierBlockMetadata {
  type: SeatType;
  displayName: string;
  rows: RowMetadata[];
  topY: number;
  bottomY: number;
  // Prop placeholder for price if wired in the future
  priceLabel?: string;
}

export interface PreviewLayoutData {
  seats: CalculatedSeatPosition[];
  totalSeats: number;
  rowCount: number;
  sections: { id: string; name: string; totalSeats: number }[];
  maxSeatsInAnyRow: number;
}

export function buildPreviewData(config: SectionLayoutConfig): PreviewLayoutData {
  const seats = computeSectionLayoutPositions(config);
  const totalSeats = seats.length;

  const sectionTotals: Record<string, number> = {};
  config.sections.forEach((s) => {
    sectionTotals[s.id] = 0;
  });

  for (const s of seats) {
    if (s.sectionId) {
      sectionTotals[s.sectionId] = (sectionTotals[s.sectionId] || 0) + 1;
    }
  }

  const sections = config.sections.map((s) => ({
    id: s.id,
    name: s.name,
    totalSeats: sectionTotals[s.id] || 0,
  }));

  const maxSeatsInAnyRow = config.rows.reduce(
    (max, r) => Math.max(max, computeRowTotalSeats(r, config.sections)),
    0,
  );

  return {
    seats,
    totalSeats,
    rowCount: config.rows.length,
    sections,
    maxSeatsInAnyRow,
  };
}

export interface LayoutMetadata {
  rows: RowMetadata[];
  tierBlocks: TierBlockMetadata[];
  crossAisles: { afterRowLabel: string; y: number }[];
  bounding: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  totalSeats: number;
}

/**
 * Calculates total seats for a row across all its sections.
 */
export function computeRowTotalSeats(row: LayoutRowConfig, sections: LayoutSection[]): number {
  return sections.reduce((sum, sec) => {
    const count = Number(row.sectionSeats[sec.id]);
    return sum + (isNaN(count) || count < 0 ? 0 : count);
  }, 0);
}

/**
 * Generates tightly-pitched BookMyShow seating coordinates for the blueprint builder.
 * Seat size: 28x24px, 4px X gap (32px pitch), 6px Y gap (30px pitch).
 */
export function computeSectionLayoutPositions(config: SectionLayoutConfig): CalculatedSeatPosition[] {
  const {
    sections,
    rows,
    verticalAisleSpacing = 2.0,
    horizontalAisleSpacing = 1.5,
  } = config;

  if (rows.length === 0 || sections.length === 0) {
    return [];
  }

  // Aisles are whole numbers of empty seat slots so every seat stays on the pitch grid:
  // Compact (1.5) -> 1 slot (60px delta), Standard (2.0) -> 2 slots (90px delta), Wide (3.0) -> 3 slots (120px delta)
  let verticalAisleSlots: number;
  if (verticalAisleSpacing <= 0) {
    verticalAisleSlots = 0;
  } else if (verticalAisleSpacing <= 1.5) {
    verticalAisleSlots = 1;
  } else if (verticalAisleSpacing >= 2.5) {
    verticalAisleSlots = 3;
  } else {
    verticalAisleSlots = 2;
  }

  const verticalAisleWidth =
    verticalAisleSlots > 0 ? verticalAisleSlots * SEAT_PITCH_X + SEAT_GAP_X : SEAT_GAP_X;

  // Cross-aisles are whole numbers of empty row slots so every row stays on the 28px pitch grid:
  // Compact (1.2) -> 1 slot (28px extra), Standard (1.5) -> 2 slots (56px extra), Wide (2.2) -> 3 slots (84px extra)
  let crossAisleSlots: number;
  if (horizontalAisleSpacing <= 0) {
    crossAisleSlots = 0;
  } else if (horizontalAisleSpacing <= 1.2) {
    crossAisleSlots = 1;
  } else if (horizontalAisleSpacing >= 2.0) {
    crossAisleSlots = 3;
  } else {
    crossAisleSlots = 2;
  }

  const crossAisleHeight = crossAisleSlots * CROSS_AISLE_HEIGHT_DEFAULT;

  // 1. Determine max seat count per section across all rows to establish section widths
  const sectionMaxSeats: Record<string, number> = {};
  for (const sec of sections) {
    let max = 0;
    for (const row of rows) {
      const count = Number(row.sectionSeats[sec.id]) || 0;
      if (count > max) max = count;
    }
    sectionMaxSeats[sec.id] = Math.max(max, 1);
  }

  // 2. Compute starting pixel X offset for each section
  const sectionXOffsets: Record<string, number> = {};
  let currentX = 0;
  sections.forEach((sec, idx) => {
    sectionXOffsets[sec.id] = currentX;
    const secWidth = sectionMaxSeats[sec.id] * SEAT_PITCH_X - SEAT_GAP_X;
    currentX += secWidth;
    if (idx < sections.length - 1) {
      currentX += verticalAisleWidth;
    }
  });

  const totalPixelWidth = Math.max(currentX, SEAT_WIDTH);

  // 3. Compute starting pixel Y offset for each row (including cross-aisles and tier gaps)
  const rowYOffsets: number[] = [];
  let currentY = 0;
  rows.forEach((row, rowIndex) => {
    rowYOffsets[rowIndex] = currentY;

    // Normal row progression
    currentY += SEAT_PITCH_Y;

    // Additional cross-aisle gap if specified
    if (row.hasHorizontalAisleAfter && rowIndex < rows.length - 1) {
      currentY += crossAisleHeight;
    }
  });

  const totalPixelHeight = Math.max(currentY - SEAT_GAP_Y, SEAT_HEIGHT);

  // 4. Position seats and compute normalized floats [0, 1]
  const positions: CalculatedSeatPosition[] = [];

  rows.forEach((row, rowIndex) => {
    const pixelY = rowYOffsets[rowIndex];
    const normalizedY = totalPixelHeight > 0 ? Math.round((pixelY / totalPixelHeight) * 10000) / 10000 : 0;

    let seatNumberCounter = 1;

    sections.forEach((sec, secIdx) => {
      const seatCount = Number(row.sectionSeats[sec.id]) || 0;
      if (seatCount <= 0) return;

      const secStartX = sectionXOffsets[sec.id];

      for (let s = 0; s < seatCount; s++) {
        const pixelX = secStartX + s * SEAT_PITCH_X;
        const normalizedX = totalPixelWidth > 0 ? Math.round((pixelX / totalPixelWidth) * 10000) / 10000 : 0;

        positions.push({
          rowLabel: row.rowLabel.trim().toUpperCase(),
          seatNumber: seatNumberCounter,
          type: row.type,
          sectionId: sec.id,
          sectionIndex: secIdx,
          pixelX,
          pixelY,
          x: Math.min(Math.max(normalizedX, 0), 1),
          y: Math.min(Math.max(normalizedY, 0), 1),
          nx: Math.round(((BLOCK_ORIGIN.x + pixelX) / WORLD_WIDTH) * 10000) / 10000,
          ny: Math.round(((BLOCK_ORIGIN.y + pixelY) / WORLD_HEIGHT) * 10000) / 10000,
        });

        seatNumberCounter++;
      }
    });
  });

  return positions;
}

/**
 * Reconstructs rich layout metadata (rows, sections, cross-aisles, tier blocks)
 * purely from saved seat coordinates and labels. All returned positions are world pixels.
 *
 * Rule: Always groups rows by backend `rowLabel`, NEVER by comparing Y values.
 */
export function computeLayoutMetadata(seats: Seat[]): LayoutMetadata {
  if (seats.length === 0) {
    return {
      rows: [],
      tierBlocks: [],
      crossAisles: [],
      bounding: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 },
      totalSeats: 0,
    };
  }

  // 1. Group strictly by `rowLabel`
  const rowMap = new Map<string, Seat[]>();
  for (const s of seats) {
    const label = s.rowLabel.trim().toUpperCase();
    const list = rowMap.get(label) || [];
    list.push(s);
    rowMap.set(label, list);
  }

  // 2. Build sorted rows by average Y position
  const rawRows: {
    rowLabel: string;
    type: SeatType;
    avgY: number;
    minX: number;
    maxX: number;
    seats: Seat[];
    hasOrderMismatch?: boolean;
    sections?: Seat[][];
  }[] = [];

  for (const [rowLabel, rowSeats] of rowMap.entries()) {
    // Sort seats in row from left to right by x
    rowSeats.sort((a, b) => a.x - b.x);

    const avgY = (rowSeats.reduce((sum, s) => sum + s.y, 0) / rowSeats.length) * WORLD_HEIGHT;
    const minX = Math.min(...rowSeats.map((s) => s.x)) * WORLD_WIDTH;
    const maxX = (Math.max(...rowSeats.map((s) => s.x)) * WORLD_WIDTH) + SEAT_WIDTH;
    const type = rowSeats[0]?.type || 'REGULAR';

    // Check if x-order matches seatNumber order
    const seatsByNumber = [...rowSeats].sort((a, b) => a.seatNumber - b.seatNumber);
    const hasOrderMismatch = rowSeats.some((s, idx) => s.id !== seatsByNumber[idx].id);

    // Group seats into sections separated by a horizontal gap > 1.5 seat widths
    const sections: Seat[][] = [];
    let currentSec: Seat[] = [];
    for (let sIdx = 0; sIdx < rowSeats.length; sIdx++) {
      if (sIdx > 0) {
        const gap = (rowSeats[sIdx].x - rowSeats[sIdx - 1].x) * WORLD_WIDTH;
        if (gap > 1.5 * SEAT_WIDTH) {
          if (currentSec.length > 0) sections.push(currentSec);
          currentSec = [];
        }
      }
      currentSec.push(rowSeats[sIdx]);
    }
    if (currentSec.length > 0) sections.push(currentSec);

    rawRows.push({
      rowLabel,
      type,
      avgY,
      minX,
      maxX,
      seats: rowSeats,
      hasOrderMismatch,
      sections,
    });
  }

  // Sort rows vertically top-to-bottom
  rawRows.sort((a, b) => a.avgY - b.avgY);

  // 3. Detect normal row pitch and identify true cross-aisles
  // Calculate average delta between consecutive rows
  const deltas: number[] = [];
  for (let i = 0; i < rawRows.length - 1; i++) {
    const diff = rawRows[i + 1].avgY - rawRows[i].avgY;
    if (diff > 0) deltas.push(diff);
  }

  // Median or minimum delta represents the standard row pitch
  deltas.sort((a, b) => a - b);
  const normalRowPitch = deltas.length > 0 ? deltas[0] : SEAT_PITCH_Y;
  // A cross-aisle is only marked when gap is significantly larger than standard row pitch (~1.35x)
  const crossAisleThreshold = normalRowPitch * 1.35;

  const rows: RowMetadata[] = [];
  const crossAisles: { afterRowLabel: string; y: number }[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const r = rawRows[i];
    let hasAisleAfter = false;

    if (i < rawRows.length - 1) {
      const nextR = rawRows[i + 1];
      const gap = nextR.avgY - r.avgY;

      if (gap > crossAisleThreshold) {
        hasAisleAfter = true;
        crossAisles.push({
          afterRowLabel: r.rowLabel,
          y: (r.avgY + nextR.avgY) / 2,
        });
      }
    }

    rows.push({
      ...r,
      hasAisleAfter,
    });
  }

  // 4. Group consecutive rows of identical tier into Tier Blocks
  const tierBlocks: TierBlockMetadata[] = [];
  let currentBlockRows: RowMetadata[] = [];
  let currentType: SeatType | null = null;

  const commitBlock = () => {
    if (currentBlockRows.length > 0 && currentType) {
      const topY = Math.min(...currentBlockRows.map((r) => r.avgY));
      const bottomY = Math.max(...currentBlockRows.map((r) => r.avgY)) + SEAT_HEIGHT;
      tierBlocks.push({
        type: currentType,
        displayName: currentType,
        rows: currentBlockRows,
        topY,
        bottomY,
      });
      currentBlockRows = [];
    }
  };

  for (const r of rows) {
    if (currentType === null) {
      currentType = r.type;
      currentBlockRows.push(r);
    } else if (r.type === currentType) {
      currentBlockRows.push(r);
    } else {
      commitBlock();
      currentType = r.type;
      currentBlockRows.push(r);
    }
  }
  commitBlock();

  // 5. Compute tight bounding box across all seats
  let minSeatX = Infinity;
  let maxSeatX = -Infinity;
  let minSeatY = Infinity;
  let maxSeatY = -Infinity;

  for (const r of rows) {
    if (r.minX < minSeatX) minSeatX = r.minX;
    if (r.maxX > maxSeatX) maxSeatX = r.maxX;
    if (r.avgY < minSeatY) minSeatY = r.avgY;
    if (r.avgY + SEAT_HEIGHT > maxSeatY) maxSeatY = r.avgY + SEAT_HEIGHT;
  }

  return {
    rows,
    tierBlocks,
    crossAisles,
    bounding: {
      minX: minSeatX,
      maxX: maxSeatX,
      minY: minSeatY,
      maxY: maxSeatY,
      width: Math.max(maxSeatX - minSeatX, SEAT_WIDTH),
      height: Math.max(maxSeatY - minSeatY, SEAT_HEIGHT),
    },
    totalSeats: seats.length,
  };
}

/**
 * Correlates newly created backend seats with the computed section layout positions.
 */
export function mapCreatedSeatsToLayoutCoordinates(
  createdSeats: Seat[],
  config: SectionLayoutConfig,
): { seatId: string; x: number; y: number; rotation: number }[] {
  const calculatedPositions = computeSectionLayoutPositions(config);

  const positionMap = new Map<string, { x: number; y: number }>();
  for (const pos of calculatedPositions) {
    const key = `${pos.rowLabel.trim().toUpperCase()}__${pos.seatNumber}`;
    positionMap.set(key, { x: pos.nx, y: pos.ny });
  }

  return createdSeats.map((seat) => {
    const key = `${seat.rowLabel.trim().toUpperCase()}__${seat.seatNumber}`;
    const calculatedPos = positionMap.get(key);

    if (!calculatedPos) {
      throw new Error(
        `Missing calculated layout coordinates for seat ${seat.rowLabel}${seat.seatNumber} (key: ${key})`,
      );
    }

    return {
      seatId: seat.id,
      x: calculatedPos.x,
      y: calculatedPos.y,
      rotation: seat.rotation || 0,
    };
  });
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Rebuilds a tight layout (SEAT_METRICS pitch) from rowLabel and seat order.
 *
 * - Rows are grouped by rowLabel, ordered top to bottom by their current average Y, and
 *   every seat of a row is placed on the same Y.
 * - Seats keep their seatNumber order inside the row.
 * - The "normal" pitch of the existing layout (median spacing) is inferred. A gap is kept
 *   ONLY when it exceeds that normal pitch, and it is kept as a whole number of seat slots
 *   (or row slots), so the result sits exactly on the snap grid.
 * - Irregular row starts are kept as whole-slot indents from the left-most seat.
 */
export function repackSeatsLayout(
  seats: Seat[],
): { id: string; seatId: string; x: number; y: number; rotation: number }[] {
  if (seats.length === 0) return [];

  const rowMap = new Map<string, Seat[]>();
  for (const s of seats) {
    const label = s.rowLabel.trim().toUpperCase();
    const list = rowMap.get(label) || [];
    list.push(s);
    rowMap.set(label, list);
  }

  const toWorld = (seat: Seat) => ({ x: seat.x * WORLD_WIDTH, y: seat.y * WORLD_HEIGHT });

  const rows = Array.from(rowMap.values()).map((rowSeats) => {
    const ordered = [...rowSeats].sort((a, b) => a.seatNumber - b.seatNumber);
    const avgY = ordered.reduce((sum, s) => sum + toWorld(s).y, 0) / ordered.length;
    return { seats: ordered, avgY, firstX: toWorld(ordered[0]).x };
  });
  rows.sort((a, b) => a.avgY - b.avgY);

  // Infer the existing "normal" pitch (median of positive deltas, ignoring overlaps)
  const rowDeltas: number[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const diff = rows[i + 1].avgY - rows[i].avgY;
    if (diff > 1) rowDeltas.push(diff);
  }
  const seatDeltas: number[] = [];
  for (const row of rows) {
    for (let i = 0; i < row.seats.length - 1; i++) {
      const diff = toWorld(row.seats[i + 1]).x - toWorld(row.seats[i]).x;
      if (diff > 1) seatDeltas.push(diff);
    }
  }
  const normalRowDelta = median(rowDeltas) ?? SEAT_PITCH_Y;
  const normalSeatDelta = median(seatDeltas) ?? SEAT_PITCH_X;

  const globalMinX = Math.min(...rows.map((r) => Math.min(...r.seats.map((s) => toWorld(s).x))));

  const result: { id: string; seatId: string; x: number; y: number; rotation: number }[] = [];
  let rowSlot = 0;

  rows.forEach((row, rowIndex) => {
    if (rowIndex > 0) {
      const diff = row.avgY - rows[rowIndex - 1].avgY;
      rowSlot += Math.max(1, Math.round(diff / normalRowDelta));
    }

    let seatSlot = Math.max(0, Math.round((row.firstX - globalMinX) / normalSeatDelta));

    row.seats.forEach((seat, seatIndex) => {
      if (seatIndex > 0) {
        const diff = toWorld(seat).x - toWorld(row.seats[seatIndex - 1]).x;
        seatSlot += Math.max(1, Math.round(diff / normalSeatDelta));
      }

      const worldX = BLOCK_ORIGIN.x + seatSlot * SEAT_PITCH_X;
      const worldY = BLOCK_ORIGIN.y + rowSlot * SEAT_PITCH_Y;
      result.push({
        id: seat.id,
        seatId: seat.id,
        x: Math.round(Math.min(worldX / WORLD_WIDTH, 1) * 10000) / 10000,
        y: Math.round(Math.min(worldY / WORLD_HEIGHT, 1) * 10000) / 10000,
        rotation: seat.rotation || 0,
      });
    });
  });

  return result;
}
