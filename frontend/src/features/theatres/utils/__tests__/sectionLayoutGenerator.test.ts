import { describe, it, expect } from 'vitest';
import {
  computeRowTotalSeats,
  SEAT_PITCH_X,
  SEAT_PITCH_Y,
  MULTI_SECTION_PRESETS,
  SIMPLE_PRESETS,
  computeSectionLayoutPositions,
  computeLayoutMetadata,
  mapCreatedSeatsToLayoutCoordinates,
  repackSeatsLayout,
  type LayoutSection,
  type LayoutRowConfig,
  type SectionLayoutConfig,
} from '../sectionLayoutGenerator';
import type { Seat } from '../../types/seat.types';
import { BLOCK_ORIGIN, WORLD_HEIGHT, WORLD_WIDTH } from '../seatMetrics';
import { normalizedToWorld } from '../seatCoordinates';
import { useSeatEditorStore } from '../../stores/useSeatEditorStore';

describe('sectionLayoutGenerator (Unified Layout Engine)', () => {
  const sampleSections: LayoutSection[] = [
    { id: 'sec-1', name: 'Left', defaultSeatCount: 7 },
    { id: 'sec-2', name: 'Mid-Left', defaultSeatCount: 9 },
    { id: 'sec-3', name: 'Mid-Right', defaultSeatCount: 9 },
    { id: 'sec-4', name: 'Right', defaultSeatCount: 7 },
  ];

  const sampleRows: LayoutRowConfig[] = [
    {
      id: 'r-A',
      rowLabel: 'A',
      type: 'PREMIUM',
      sectionSeats: { 'sec-1': 7, 'sec-2': 9, 'sec-3': 9, 'sec-4': 7 },
      hasHorizontalAisleAfter: false,
    },
    {
      id: 'r-B',
      rowLabel: 'B',
      type: 'PREMIUM',
      sectionSeats: { 'sec-1': 7, 'sec-2': 9, 'sec-3': 9, 'sec-4': 7 },
      hasHorizontalAisleAfter: true, // Cross-aisle here
    },
    {
      id: 'r-C',
      rowLabel: 'C',
      type: 'REGULAR',
      sectionSeats: { 'sec-1': 7, 'sec-2': 9, 'sec-3': 9, 'sec-4': 7 },
      hasHorizontalAisleAfter: false,
    },
    {
      id: 'r-D',
      rowLabel: 'D',
      type: 'REGULAR',
      sectionSeats: { 'sec-1': 6, 'sec-2': 8, 'sec-3': 8, 'sec-4': 6 }, // Tapered row
      hasHorizontalAisleAfter: false,
    },
  ];

  const sampleConfig: SectionLayoutConfig = {
    sections: sampleSections,
    rows: sampleRows,
  };

  it('calculates row seat totals correctly', () => {
    expect(computeRowTotalSeats(sampleRows[0], sampleSections)).toBe(32);
    expect(computeRowTotalSeats(sampleRows[3], sampleSections)).toBe(28);
  });

  it('generates tight 30x28px layout positions with vertical walking aisles', () => {
    const positions = computeSectionLayoutPositions(sampleConfig);
    expect(positions.length).toBe(32 + 32 + 32 + 28); // 124 seats

    const rowA = positions.filter((p) => p.rowLabel === 'A');
    expect(rowA.length).toBe(32);

    // Continuous numbering from 1 to 32
    expect(rowA[0].seatNumber).toBe(1);
    expect(rowA[31].seatNumber).toBe(32);

    // Section 1 has 7 seats (indices 0..6)
    // Between seat 7 (index 6) and seat 8 (index 7), there must be a vertical aisle gap
    const seat7 = rowA[6];
    const seat8 = rowA[7];
    const normalDelta = rowA[1].pixelX - rowA[0].pixelX; // 30px pitch
    const aisleDelta = seat8.pixelX - seat7.pixelX;

    expect(normalDelta).toBe(30);
    expect(aisleDelta).toBe(90); // Two empty seat slots: stays on the pitch grid
  });

  it('computes cross-aisles accurately without false positives between normal rows', () => {
    const positions = computeSectionLayoutPositions(sampleConfig);

    // Convert positions to mock Seat objects
    const mockSeats: Seat[] = positions.map((p, idx) => ({
      id: `seat-${idx}`,
      screenId: 'screen-1',
      rowLabel: p.rowLabel,
      seatNumber: p.seatNumber,
      label: `${p.rowLabel}${p.seatNumber}`,
      x: p.nx,
      y: p.ny,
      rotation: 0,
      type: p.type,
      isActive: true,
    }));

    const metadata = computeLayoutMetadata(mockSeats);

    expect(metadata.rows.length).toBe(4);
    // Only row B has a cross-aisle after it
    expect(metadata.crossAisles.length).toBe(1);
    expect(metadata.crossAisles[0].afterRowLabel).toBe('B');

    expect(metadata.rows.find((r) => r.rowLabel === 'A')?.hasAisleAfter).toBe(false);
    expect(metadata.rows.find((r) => r.rowLabel === 'B')?.hasAisleAfter).toBe(true);
    expect(metadata.rows.find((r) => r.rowLabel === 'C')?.hasAisleAfter).toBe(false);
    expect(metadata.rows.find((r) => r.rowLabel === 'D')?.hasAisleAfter).toBe(false);
  });

  it('groups consecutive rows into tier blocks', () => {
    const positions = computeSectionLayoutPositions(sampleConfig);
    const mockSeats: Seat[] = positions.map((p, idx) => ({
      id: `seat-${idx}`,
      screenId: 'screen-1',
      rowLabel: p.rowLabel,
      seatNumber: p.seatNumber,
      label: `${p.rowLabel}${p.seatNumber}`,
      x: p.nx,
      y: p.ny,
      rotation: 0,
      type: p.type,
      isActive: true,
    }));

    const metadata = computeLayoutMetadata(mockSeats);

    // Should have 2 tier blocks: PREMIUM (rows A, B) and REGULAR (rows C, D)
    expect(metadata.tierBlocks.length).toBe(2);
    expect(metadata.tierBlocks[0].type).toBe('PREMIUM');
    expect(metadata.tierBlocks[0].rows.map((r) => r.rowLabel)).toEqual(['A', 'B']);
    expect(metadata.tierBlocks[1].type).toBe('REGULAR');
    expect(metadata.tierBlocks[1].rows.map((r) => r.rowLabel)).toEqual(['C', 'D']);
  });

  it('strictly groups rows by rowLabel from backend, never splitting Row A into sub-rows', () => {
    // Deliberately simulate Row A having perturbed/misaligned Y values (e.g. from previous manual drags)
    const misalignedSeats: Seat[] = [
      {
        id: 's-A1',
        screenId: 'sc-1',
        rowLabel: 'A',
        seatNumber: 1,
        label: 'A1',
        x: 0.1,
        y: 0.05,
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      },
      {
        id: 's-A2',
        screenId: 'sc-1',
        rowLabel: 'A',
        seatNumber: 2,
        label: 'A2',
        x: 0.2,
        y: 0.15, // Different Y
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      },
      {
        id: 's-B1',
        screenId: 'sc-1',
        rowLabel: 'B',
        seatNumber: 1,
        label: 'B1',
        x: 0.1,
        y: 0.3,
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      },
    ];

    const metadata = computeLayoutMetadata(misalignedSeats);

    // Row A must remain a single row with 2 seats
    expect(metadata.rows.length).toBe(2);
    const rowA = metadata.rows.find((r) => r.rowLabel === 'A');
    expect(rowA).toBeDefined();
    expect(rowA!.seats.length).toBe(2);
  });

  it('repacks seats to clean non-overlapping coordinates while preserving order and aisles', () => {
    const dirtySeats: Seat[] = [
      {
        id: 's-1',
        screenId: 'sc-1',
        rowLabel: 'A',
        seatNumber: 1,
        label: 'A1',
        x: 0.05,
        y: 0.1,
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      },
      {
        id: 's-2',
        screenId: 'sc-1',
        rowLabel: 'A',
        seatNumber: 2,
        label: 'A2',
        x: 0.06, // Almost overlapping
        y: 0.1,
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      },
      {
        id: 's-3',
        screenId: 'sc-1',
        rowLabel: 'B',
        seatNumber: 1,
        label: 'B1',
        x: 0.05,
        y: 0.25,
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      },
    ];

    const repacked = repackSeatsLayout(dirtySeats);
    expect(repacked.length).toBe(3);

    const seat1 = repacked.find((s) => s.seatId === 's-1')!;
    const seat2 = repacked.find((s) => s.seatId === 's-2')!;

    // In row A, seat 2 should now have proper horizontal spacing from seat 1
    expect(seat2.x).toBeGreaterThan(seat1.x);
    expect(seat1.y).toBe(seat2.y); // Same row has clean identical Y
  });

  describe('tight pitch and repack', () => {
    const worldX = (nx: number) => nx * WORLD_WIDTH;
    const worldY = (ny: number) => ny * WORLD_HEIGHT;

    const makeSeat = (rowLabel: string, seatNumber: number, px: number, py: number): Seat => ({
      id: `${rowLabel}${seatNumber}`,
      screenId: 'sc-1',
      rowLabel,
      seatNumber,
      label: `${rowLabel}${seatNumber}`,
      x: px / WORLD_WIDTH,
      y: py / WORLD_HEIGHT,
      rotation: 0,
      type: 'REGULAR',
      isActive: true,
    });

    const blockConfig = (rows: number, seatsPerRow: number): SectionLayoutConfig => ({
      sections: [{ id: 'main', name: 'Main', defaultSeatCount: seatsPerRow }],
      rows: Array.from({ length: rows }, (_, i) => ({
        id: `r${i}`,
        rowLabel: String.fromCharCode(65 + i),
        type: 'REGULAR' as const,
        sectionSeats: { main: seatsPerRow },
      })),
    });

    it('packs a generated block at exactly 30x28 regardless of seat count', () => {
      for (const [rows, perRow] of [
        [3, 5],
        [12, 40],
      ]) {
        const positions = computeSectionLayoutPositions(blockConfig(rows, perRow));
        const a1 = positions.find((p) => p.rowLabel === 'A' && p.seatNumber === 1)!;
        const a2 = positions.find((p) => p.rowLabel === 'A' && p.seatNumber === 2)!;
        const b1 = positions.find((p) => p.rowLabel === 'B' && p.seatNumber === 1)!;

        expect(worldX(a2.nx) - worldX(a1.nx)).toBeCloseTo(SEAT_PITCH_X, 0);
        expect(worldY(b1.ny) - worldY(a1.ny)).toBeCloseTo(SEAT_PITCH_Y, 0);
        expect(worldX(a1.nx)).toBeCloseTo(BLOCK_ORIGIN.x, 0);
        expect(worldY(a1.ny)).toBeCloseTo(BLOCK_ORIGIN.y, 0);
      }
    });

    it('repacks a legacy wide layout (83px x 154px pitch) into the tight pitch', () => {
      const legacy: Seat[] = [];
      for (let r = 0; r < 3; r++) {
        for (let n = 1; n <= 4; n++) {
          legacy.push(makeSeat(String.fromCharCode(65 + r), n, 100 + (n - 1) * 83, 100 + r * 154));
        }
      }

      const repacked = repackSeatsLayout(legacy);
      const get = (id: string) => repacked.find((s) => s.seatId === id)!;

      expect(worldX(get('A2').x) - worldX(get('A1').x)).toBeCloseTo(SEAT_PITCH_X, 0);
      expect(worldX(get('A4').x) - worldX(get('A3').x)).toBeCloseTo(SEAT_PITCH_X, 0);
      expect(worldY(get('B1').y) - worldY(get('A1').y)).toBeCloseTo(SEAT_PITCH_Y, 0);
      expect(worldY(get('C1').y) - worldY(get('B1').y)).toBeCloseTo(SEAT_PITCH_Y, 0);
    });

    it('keeps manual gaps only when they exceed the normal pitch', () => {
      const pitch = SEAT_PITCH_X;
      const slots = [0, 1, 2, 5, 6]; // gap of two empty slots between seat 3 and seat 4
      const seats = slots.map((slot, i) => makeSeat('A', i + 1, 200 + slot * pitch, 200));
      seats.push(
        ...[0, 1, 2, 3, 4].map((slot, i) => makeSeat('B', i + 1, 200 + slot * pitch, 200 + SEAT_PITCH_Y)),
      );

      const repacked = repackSeatsLayout(seats);
      const get = (id: string) => repacked.find((s) => s.seatId === id)!;

      expect(worldX(get('A4').x) - worldX(get('A3').x)).toBeCloseTo(3 * SEAT_PITCH_X, 0);
      expect(worldX(get('A5').x) - worldX(get('A4').x)).toBeCloseTo(SEAT_PITCH_X, 0);
      expect(worldX(get('B3').x) - worldX(get('B2').x)).toBeCloseTo(SEAT_PITCH_X, 0);
    });

    it('keeps a cross-aisle between row groups but removes accidental extra spacing', () => {
      const seats = [
        makeSeat('A', 1, 200, 200),
        makeSeat('B', 1, 200, 228),
        makeSeat('C', 1, 200, 284), // one empty row slot above C
        makeSeat('D', 1, 200, 312),
      ];

      const repacked = repackSeatsLayout(seats);
      const y = (id: string) => worldY(repacked.find((s) => s.seatId === id)!.y);

      expect(y('B1') - y('A1')).toBeCloseTo(SEAT_PITCH_Y, 0);
      expect(y('C1') - y('B1')).toBeCloseTo(2 * SEAT_PITCH_Y, 0);
      expect(y('D1') - y('C1')).toBeCloseTo(SEAT_PITCH_Y, 0);
    });
    it('detects intra-row sections separated by gaps greater than 1.5 seat widths', () => {
      const seats: Seat[] = [
        makeSeat('A', 1, 100, 100),
        makeSeat('A', 2, 130, 100),
        // Gap of 90px (> 1.5 * 28px = 42px) -> creates Section 2
        makeSeat('A', 3, 220, 100),
        makeSeat('A', 4, 250, 100),
      ];

      const metadata = computeLayoutMetadata(seats);
      const rowA = metadata.rows.find((r) => r.rowLabel === 'A')!;

      expect(rowA.sections).toBeDefined();
      expect(rowA.sections).toHaveLength(2);
      expect(rowA.sections![0].map((s) => s.seatNumber)).toEqual([1, 2]);
      expect(rowA.sections![1].map((s) => s.seatNumber)).toEqual([3, 4]);
    });

    it('flags hasOrderMismatch when x-order differs from stored seatNumber order', () => {
      // Inverted order: seat 2 is placed at x = 100, seat 1 is placed at x = 140
      const invertedSeats: Seat[] = [
        makeSeat('A', 2, 100, 100),
        makeSeat('A', 1, 140, 100),
      ];

      const metaInverted = computeLayoutMetadata(invertedSeats);
      const rowInverted = metaInverted.rows.find((r) => r.rowLabel === 'A')!;
      expect(rowInverted.hasOrderMismatch).toBe(true);

      // Normal aligned order
      const normalSeats: Seat[] = [
        makeSeat('A', 1, 100, 100),
        makeSeat('A', 2, 130, 100),
      ];

      const metaNormal = computeLayoutMetadata(normalSeats);
      const rowNormal = metaNormal.rows.find((r) => r.rowLabel === 'A')!;
      expect(rowNormal.hasOrderMismatch).toBe(false);
    });
  });

  describe('End-to-End Pipeline Trace, Renderer Parity & Presets Regression', () => {
    /**
     * Simulates BulkCreateSeatsUseCase output (one continuous left-aligned block per row)
     */
    const simulateBulkCreate = (config: SectionLayoutConfig): Seat[] => {
      const seats: Seat[] = [];
      config.rows.forEach((row, rowIndex) => {
        const count = computeRowTotalSeats(row, config.sections);
        const worldY = BLOCK_ORIGIN.y + rowIndex * SEAT_PITCH_Y;
        const ny = Math.round(Math.min(worldY / WORLD_HEIGHT, 1) * 10000) / 10000;
        for (let s = 1; s <= count; s++) {
          const worldX = BLOCK_ORIGIN.x + (s - 1) * SEAT_PITCH_X;
          const nx = Math.round(Math.min(worldX / WORLD_WIDTH, 1) * 10000) / 10000;
          seats.push({
            id: `seat-${row.rowLabel}-${s}`,
            screenId: 'sc-trace',
            rowLabel: row.rowLabel,
            seatNumber: s,
            label: `${row.rowLabel}${s}`,
            x: nx,
            y: ny,
            rotation: 0,
            type: row.type,
            isActive: true,
          });
        }
      });
      return seats;
    };

    it('traces BMS_4_SECTION (7-9-9-7, 622 seats) across steps a-f and matches preview pixelX/pixelY within 1px', () => {
      const preset = MULTI_SECTION_PRESETS.BMS_4_SECTION;
      const config: SectionLayoutConfig = {
        sections: preset.sections,
        rows: preset.rows,
        verticalAisleSpacing: 2.0,
        horizontalAisleSpacing: 1.5,
      };

      // Step a) computeSectionLayoutPositions output
      const positions = computeSectionLayoutPositions(config);
      expect(positions).toHaveLength(622);

      const getPos = (rowLabel: string, seatNumber: number) =>
        positions.find((p) => p.rowLabel === rowLabel && p.seatNumber === seatNumber)!;

      // Verify Row A section boundary coordinates (7 - 9 - 9 - 7)
      expect(getPos('A', 1).pixelX).toBe(0);
      expect(getPos('A', 7).pixelX).toBe(180);
      expect(getPos('A', 8).pixelX).toBe(270); // +90px (2 empty seat slots for vertical aisle 1)
      expect(getPos('A', 16).pixelX).toBe(510);
      expect(getPos('A', 17).pixelX).toBe(600); // +90px (vertical aisle 2)
      expect(getPos('A', 25).pixelX).toBe(840);
      expect(getPos('A', 26).pixelX).toBe(930); // +90px (vertical aisle 3)
      expect(getPos('A', 32).pixelX).toBe(1110);

      // Step b) Payload sent to seat-layout PATCH via mapCreatedSeatsToLayoutCoordinates
      const bulkCreated = simulateBulkCreate(config);
      const patchPayload = mapCreatedSeatsToLayoutCoordinates(bulkCreated, config);
      expect(patchPayload).toHaveLength(622);

      // Step c) & d) UpdateSeatLayoutUseCase / GET /seat-layout persisted seats
      const patchMap = new Map(patchPayload.map((u) => [u.seatId, u]));
      const savedSeats: Seat[] = bulkCreated.map((s) => {
        const u = patchMap.get(s.id)!;
        return { ...s, x: u.x, y: u.y, rotation: u.rotation };
      });

      // Step e) initEditor puts seats into useSeatEditorStore
      useSeatEditorStore.getState().initEditor('th-1', 'sc-trace', 'Screen 1', savedSeats);
      const storeSeats = useSeatEditorStore.getState().seats;
      expect(storeSeats).toHaveLength(622);

      // Step f) SeatCanvas normalizedToWorld vs preview pixelX / pixelY (within 1px)
      for (const storeSeat of storeSeats) {
        const previewPos = getPos(storeSeat.rowLabel, storeSeat.seatNumber);
        const worldPos = normalizedToWorld(storeSeat.x, storeSeat.y);
        const relativeWorldX = worldPos.x - BLOCK_ORIGIN.x;
        const relativeWorldY = worldPos.y - BLOCK_ORIGIN.y;

        expect(Math.abs(relativeWorldX - previewPos.pixelX)).toBeLessThanOrEqual(1);
        expect(Math.abs(relativeWorldY - previewPos.pixelY)).toBeLessThanOrEqual(1);
      }

      // Step 3 metadata verification: 4 sections per row, cross-aisles after SB, F, L, and 3 tier blocks
      const metadata = computeLayoutMetadata(storeSeats);
      expect(metadata.rows).toHaveLength(20);
      expect(metadata.rows.map((r) => r.rowLabel)).toEqual([
        'SA', 'SB', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
      ]);

      for (const row of metadata.rows) {
        expect(row.sections).toHaveLength(4);
      }

      expect(metadata.crossAisles.map((ca) => ca.afterRowLabel)).toEqual(['SB', 'F', 'L']);

      expect(metadata.tierBlocks.map((tb) => ({
        type: tb.type,
        rows: tb.rows.map((r) => r.rowLabel),
      }))).toEqual([
        { type: 'RECLINER', rows: ['SA', 'SB'] },
        { type: 'PREMIUM', rows: ['A', 'B', 'C', 'D', 'E', 'F'] },
        { type: 'REGULAR', rows: ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'] },
      ]);
    });

    it('throws an error in mapCreatedSeatsToLayoutCoordinates when a seat has no layout match', () => {
      const config: SectionLayoutConfig = {
        sections: [{ id: 's1', name: 'Left', defaultSeatCount: 2 }],
        rows: [{ id: 'r1', rowLabel: 'A', type: 'REGULAR', sectionSeats: { s1: 2 } }],
      };
      const mismatchedSeats: Seat[] = [
        {
          id: 's-bad',
          screenId: 'sc-1',
          rowLabel: 'Z',
          seatNumber: 99,
          label: 'Z99',
          x: 0.1,
          y: 0.1,
          rotation: 0,
          type: 'REGULAR',
          isActive: true,
        },
      ];

      expect(() => mapCreatedSeatsToLayoutCoordinates(mismatchedSeats, config)).toThrow(
        /Missing calculated layout coordinates for seat Z99/,
      );
    });

    it('produces strictly different aisle widths for Compact, Standard, and Wide in both preview and saved layout', () => {
      const preset = MULTI_SECTION_PRESETS.BMS_TRIPLE;

      const compactPositions = computeSectionLayoutPositions({
        sections: preset.sections,
        rows: preset.rows,
        verticalAisleSpacing: 1.5, // Compact
        horizontalAisleSpacing: 1.2, // Compact
      });

      const standardPositions = computeSectionLayoutPositions({
        sections: preset.sections,
        rows: preset.rows,
        verticalAisleSpacing: 2.0, // Standard
        horizontalAisleSpacing: 1.5, // Standard
      });

      const widePositions = computeSectionLayoutPositions({
        sections: preset.sections,
        rows: preset.rows,
        verticalAisleSpacing: 3.0, // Wide
        horizontalAisleSpacing: 2.2, // Wide
      });

      const getVGap = (list: typeof compactPositions) => {
        const a7 = list.find((p) => p.rowLabel === 'A' && p.seatNumber === 7)!;
        const a8 = list.find((p) => p.rowLabel === 'A' && p.seatNumber === 8)!;
        return {
          previewGapPx: a8.pixelX - a7.pixelX,
          savedGapNx: a8.nx - a7.nx,
        };
      };

      const getHGap = (list: typeof compactPositions) => {
        const c1 = list.find((p) => p.rowLabel === 'C' && p.seatNumber === 1)!;
        const d1 = list.find((p) => p.rowLabel === 'D' && p.seatNumber === 1)!;
        return {
          previewGapPy: d1.pixelY - c1.pixelY,
          savedGapNy: d1.ny - c1.ny,
        };
      };

      const vCompact = getVGap(compactPositions);
      const vStandard = getVGap(standardPositions);
      const vWide = getVGap(widePositions);

      expect(vCompact.previewGapPx).toBe(60); // 1 empty seat slot
      expect(vStandard.previewGapPx).toBe(90); // 2 empty seat slots
      expect(vWide.previewGapPx).toBe(120); // 3 empty seat slots
      expect(vCompact.savedGapNx).toBeLessThan(vStandard.savedGapNx);
      expect(vStandard.savedGapNx).toBeLessThan(vWide.savedGapNx);

      const hCompact = getHGap(compactPositions);
      const hStandard = getHGap(standardPositions);
      const hWide = getHGap(widePositions);

      expect(hCompact.previewGapPy).toBe(56); // 1 empty row slot
      expect(hStandard.previewGapPy).toBe(84); // 2 empty row slots
      expect(hWide.previewGapPy).toBe(112); // 3 empty row slots
      expect(hCompact.savedGapNy).toBeLessThan(hStandard.savedGapNy);
      expect(hStandard.savedGapNy).toBeLessThan(hWide.savedGapNy);
    });

    it('packs Simple (continuous) mode into one tight block with 1 section and 0 cross-aisles', () => {
      const simpleRows = SIMPLE_PRESETS.CLASSIC_HALL.rows;
      const simpleConfig: SectionLayoutConfig = {
        sections: [{ id: 'main', name: 'Main Seating', defaultSeatCount: 12 }],
        rows: simpleRows.map((r, i) => ({
          id: `simple-${i}`,
          rowLabel: r.rowLabel,
          type: r.type,
          sectionSeats: { main: r.seatCount },
        })),
        verticalAisleSpacing: 0,
        horizontalAisleSpacing: 0,
      };

      const positions = computeSectionLayoutPositions(simpleConfig);
      expect(positions).toHaveLength(72);

      const savedSeats: Seat[] = positions.map((p, i) => ({
        id: `simple-seat-${i}`,
        screenId: 'sc-simple',
        rowLabel: p.rowLabel,
        seatNumber: p.seatNumber,
        label: `${p.rowLabel}${p.seatNumber}`,
        x: p.nx,
        y: p.ny,
        rotation: 0,
        type: p.type,
        isActive: true,
      }));

      const metadata = computeLayoutMetadata(savedSeats);
      expect(metadata.rows).toHaveLength(6);
      expect(metadata.crossAisles).toHaveLength(0);
      for (const row of metadata.rows) {
        expect(row.sections).toHaveLength(1);
        expect(row.seats).toHaveLength(12);
      }
    });

    it('preserves all 4 sections and all 3 cross-aisles when repackSeatsLayout runs on BMS_4_SECTION', () => {
      const preset = MULTI_SECTION_PRESETS.BMS_4_SECTION;
      const config: SectionLayoutConfig = {
        sections: preset.sections,
        rows: preset.rows,
        verticalAisleSpacing: 2.0,
        horizontalAisleSpacing: 1.5,
      };

      const positions = computeSectionLayoutPositions(config);
      const initialSeats: Seat[] = positions.map((p, i) => ({
        id: `bms-seat-${i}`,
        screenId: 'sc-bms',
        rowLabel: p.rowLabel,
        seatNumber: p.seatNumber,
        label: `${p.rowLabel}${p.seatNumber}`,
        x: p.nx,
        y: p.ny,
        rotation: 0,
        type: p.type,
        isActive: true,
      }));

      const repackedUpdates = repackSeatsLayout(initialSeats);
      const repackedMap = new Map(repackedUpdates.map((u) => [u.seatId, u]));
      const repackedSeats: Seat[] = initialSeats.map((s) => {
        const u = repackedMap.get(s.id)!;
        return { ...s, x: u.x, y: u.y };
      });

      const metadata = computeLayoutMetadata(repackedSeats);
      expect(metadata.rows).toHaveLength(20);
      for (const row of metadata.rows) {
        expect(row.sections).toHaveLength(4);
      }
      expect(metadata.crossAisles.map((ca) => ca.afterRowLabel)).toEqual(['SB', 'F', 'L']);
    });
  });
});
