import { describe, it, expect, beforeEach } from 'vitest';
import { useSeatEditorStore, selectIsDirty } from '../useSeatEditorStore';
import type { Seat } from '../../types/seat.types';

describe('useSeatEditorStore', () => {
  const mockSeats: Seat[] = [
    {
      id: 's1',
      screenId: 'screen-1',
      rowLabel: 'A',
      seatNumber: 1,
      label: 'A1',
      x: 0.2,
      y: 0.3,
      rotation: 0,
      type: 'REGULAR',
      isActive: true,
    },
    {
      id: 's2',
      screenId: 'screen-1',
      rowLabel: 'A',
      seatNumber: 2,
      label: 'A2',
      x: 0.4,
      y: 0.3,
      rotation: 0,
      type: 'REGULAR',
      isActive: true,
    },
    {
      id: 's3',
      screenId: 'screen-1',
      rowLabel: 'B',
      seatNumber: 1,
      label: 'B1',
      x: 0.2,
      y: 0.6,
      rotation: 0,
      type: 'SOFA',
      isActive: true,
    },
  ];

  beforeEach(() => {
    useSeatEditorStore.getState().initEditor('th-1', 'screen-1', 'Screen 1', mockSeats);
  });

  it('initializes with clean dirty state and seats', () => {
    const state = useSeatEditorStore.getState();
    expect(state.seats).toHaveLength(3);
    expect(selectIsDirty(state)).toBe(false);
  });

  it('selects and deselects seats', () => {
    const store = useSeatEditorStore.getState();

    store.selectSeat('s1');
    expect(useSeatEditorStore.getState().selectedSeatIds.has('s1')).toBe(true);

    // Multi-select toggle
    store.selectSeat('s2', true);
    expect(useSeatEditorStore.getState().selectedSeatIds.size).toBe(2);

    // Select row
    store.selectRow('A');
    const rowA = useSeatEditorStore.getState().selectedSeatIds;
    expect(rowA.has('s1')).toBe(true);
    expect(rowA.has('s2')).toBe(true);
    expect(rowA.has('s3')).toBe(false);

    store.clearSelection();
    expect(useSeatEditorStore.getState().selectedSeatIds.size).toBe(0);
  });

  it('nudges selected seats and marks store dirty', () => {
    const store = useSeatEditorStore.getState();
    store.selectSeat('s1');
    store.nudgeSelected(0.05, 0.02);

    const updated = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    expect(updated.x).toBeCloseTo(0.25);
    expect(updated.y).toBeCloseTo(0.32);
    expect(selectIsDirty(useSeatEditorStore.getState())).toBe(true);
  });

  it('supports undo and redo', () => {
    const store = useSeatEditorStore.getState();
    store.updateSeatPosition('s1', 0.8, 0.8);
    expect(useSeatEditorStore.getState().seats[0].x).toBe(0.8);

    store.undo();
    expect(useSeatEditorStore.getState().seats[0].x).toBe(0.2);

    store.redo();
    expect(useSeatEditorStore.getState().seats[0].x).toBe(0.8);
  });

  it('updates selected properties (type and isActive)', () => {
    const store = useSeatEditorStore.getState();
    store.selectSeat('s1');
    store.updateSelectedProperties({ type: 'RECLINER', isActive: false });

    const s1 = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    expect(s1.type).toBe('RECLINER');
    expect(s1.isActive).toBe(false);
    expect(selectIsDirty(useSeatEditorStore.getState())).toBe(true);
  });

  it('aligns selected seats horizontally', () => {
    const store = useSeatEditorStore.getState();
    store.selectMultiple(['s1', 's3']); // Y: 0.3 and 0.6 -> avg = 0.45
    store.alignSelected('horizontal');

    const s1 = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    const s3 = useSeatEditorStore.getState().seats.find((s) => s.id === 's3')!;
    expect(s1.y).toBeCloseTo(0.45);
    expect(s3.y).toBeCloseTo(0.45);
  });

  it('clears dirty flag when markSaved is invoked', () => {
    const store = useSeatEditorStore.getState();
    store.updateSeatPosition('s1', 0.9, 0.9);
    expect(selectIsDirty(useSeatEditorStore.getState())).toBe(true);

    store.markSaved(useSeatEditorStore.getState().seats);
    expect(selectIsDirty(useSeatEditorStore.getState())).toBe(false);
  });

  it('inserts and removes seat gaps within a row', () => {
    const store = useSeatEditorStore.getState();
    // Select s2 (A2). A1 is to its left (x=0.2), A2 is at x=0.4
    store.selectSeat('s2');
    store.insertSeatGap(1);

    const s1 = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    const s2 = useSeatEditorStore.getState().seats.find((s) => s.id === 's2')!;
    // s1 was not shifted because it is to the left of s2
    expect(s1.x).toBe(0.2);
    // s2 shifted by 30px / 3000 = 0.01
    expect(s2.x).toBeCloseTo(0.41, 4);

    // Remove gap
    store.insertSeatGap(-1);
    const s2Restored = useSeatEditorStore.getState().seats.find((s) => s.id === 's2')!;
    expect(s2Restored.x).toBeCloseTo(0.4, 4);
  });

  it('inserts row gaps pushing all rows below down', () => {
    const store = useSeatEditorStore.getState();
    // Select row A seat s1 (y=0.3). Row B seat s3 is at y=0.6
    store.selectSeat('s1');
    store.insertRowGap(1);

    const s1 = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    const s3 = useSeatEditorStore.getState().seats.find((s) => s.id === 's3')!;

    // s1 unchanged
    expect(s1.y).toBe(0.3);
    // s3 pushed down by 28px / 2000 = 0.014
    expect(s3.y).toBeCloseTo(0.614, 4);
  });

  it('nudges selected seats by grid steps and supports single undo', () => {
    const store = useSeatEditorStore.getState();
    store.selectSeat('s1');
    store.nudgeSelectedGrid(1, 2);

    const s1 = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    expect(s1.x).toBeCloseTo(0.2 + 30 / 3000, 4);
    expect(s1.y).toBeCloseTo(0.3 + 56 / 2000, 4);

    // Single undo reverts the entire nudge
    store.undo();
    const s1Reverted = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    expect(s1Reverted.x).toBe(0.2);
    expect(s1Reverted.y).toBe(0.3);
  });

  it('moves entire row together', () => {
    const store = useSeatEditorStore.getState();
    store.moveRow('A', 0.05, 0.02);

    const s1 = useSeatEditorStore.getState().seats.find((s) => s.id === 's1')!;
    const s2 = useSeatEditorStore.getState().seats.find((s) => s.id === 's2')!;
    const s3 = useSeatEditorStore.getState().seats.find((s) => s.id === 's3')!;

    expect(s1.x).toBeCloseTo(0.25, 4);
    expect(s1.y).toBeCloseTo(0.32, 4);
    expect(s2.x).toBeCloseTo(0.45, 4);
    expect(s2.y).toBeCloseTo(0.32, 4);
    // Row B seat unaffected
    expect(s3.x).toBe(0.2);
    expect(s3.y).toBe(0.6);
  });
});

