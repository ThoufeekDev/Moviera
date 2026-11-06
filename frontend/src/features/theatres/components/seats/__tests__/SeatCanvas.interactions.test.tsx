import { describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import Konva from 'konva';
import { SeatCanvas } from '../SeatCanvas';
import { useSeatEditorStore, selectIsDirty } from '../../../stores/useSeatEditorStore';
import {
  computeLayoutFrame,
  normalizedToWorld,
  worldToNormalized,
} from '../../../utils/seatCoordinates';
import {
  BLOCK_ORIGIN,
  LAYOUT_BOX_PADDING,
  SCREEN_GAP,
  SEAT_METRICS,
} from '../../../utils/seatMetrics';
import {
  MULTI_SECTION_PRESETS,
  computeSectionLayoutPositions,
} from '../../../utils/sectionLayoutGenerator';
import type { Seat } from '../../../types/seat.types';

function makeGridSeats(
  rows: string[],
  seatsPerRow: number,
  startX: number = BLOCK_ORIGIN.x,
  startY: number = BLOCK_ORIGIN.y,
): Seat[] {
  const list: Seat[] = [];
  rows.forEach((rowLabel, rIdx) => {
    for (let s = 1; s <= seatsPerRow; s++) {
      const wx = startX + (s - 1) * SEAT_METRICS.pitchX;
      const wy = startY + rIdx * SEAT_METRICS.pitchY;
      const norm = worldToNormalized(wx, wy);
      list.push({
        id: `${rowLabel}${s}`,
        screenId: 'sc-test',
        rowLabel,
        seatNumber: s,
        label: `${rowLabel}${s}`,
        x: norm.x,
        y: norm.y,
        rotation: 0,
        type: 'REGULAR',
        isActive: true,
      });
    }
  });
  return list;
}

function getLatestStage(): Konva.Stage {
  const stage = Konva.stages[Konva.stages.length - 1];
  if (!stage) throw new Error('No Konva Stage mounted');
  return stage;
}

function fireNodeMouseDown(
  node: Konva.Node,
  clientX: number,
  clientY: number,
  options: {
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    button?: number;
    detail?: number;
  } = {},
) {
  act(() => {
    node.fire(
      'mousedown',
      {
        evt: new MouseEvent('mousedown', {
          clientX,
          clientY,
          button: options.button ?? 0,
          detail: options.detail ?? 1,
          shiftKey: options.shiftKey ?? false,
          ctrlKey: options.ctrlKey ?? false,
          altKey: options.altKey ?? false,
          bubbles: true,
        }),
      },
      true,
    );
  });
}

function fireNodeDblClick(node: Konva.Node, clientX: number, clientY: number) {
  fireNodeMouseDown(node, clientX, clientY, { detail: 1 });
  fireWindowMouseUp(clientX, clientY);
  fireNodeMouseDown(node, clientX, clientY, { detail: 2 });
  fireWindowMouseUp(clientX, clientY);
  act(() => {
    node.fire(
      'dblclick',
      {
        evt: new MouseEvent('dblclick', {
          clientX,
          clientY,
          button: 0,
          detail: 2,
          bubbles: true,
        }),
      },
      true,
    );
  });
}

function fireWindowMouseMove(clientX: number, clientY: number, options: { altKey?: boolean } = {}) {
  act(() => {
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX,
        clientY,
        altKey: options.altKey ?? false,
        bubbles: true,
      }),
    );
  });
}

function fireWindowMouseUp(clientX: number, clientY: number) {
  act(() => {
    window.dispatchEvent(
      new MouseEvent('mouseup', {
        clientX,
        clientY,
        bubbles: true,
      }),
    );
  });
}

describe('SeatCanvas Konva Interactions (1-10)', () => {
  beforeEach(() => {
    useSeatEditorStore.setState({
      theatreId: 'th-1',
      screenId: 'sc-test',
      screenName: 'Screen 1',
      initialSeats: [],
      seats: [],
      selectedSeatIds: new Set(),
      zoom: 1,
      pan: { x: 0, y: 0 },
      history: [],
      future: [],
    });
  });

  const mountWith1xStage = (seats: Seat[], snapToGrid = true) => {
    act(() => {
      useSeatEditorStore.getState().initEditor('th-1', 'sc-test', 'Screen 1', seats);
    });
    const utils = render(
      <SeatCanvas containerWidth={1200} containerHeight={800} snapToGrid={snapToGrid} />,
    );
    // Normalize stage transform to 1:1 world coordinates so clientX/Y == worldX/Y
    act(() => {
      useSeatEditorStore.getState().setZoom(1);
      useSeatEditorStore.getState().setPan({ x: 0, y: 0 });
    });
    return { ...utils, stage: getLatestStage() };
  };

  it('1. Double-click a seat to select it first, then drag 100px: single-click does not move unselected seat, double-click selects and drags it with one history entry', () => {
    const seats = makeGridSeats(['A', 'B'], 4);
    const { stage } = mountWith1xStage(seats, true);

    const a4Node = stage.findOne('#A4')!;
    const startWorld = normalizedToWorld(
      seats.find((s) => s.id === 'A4')!.x,
      seats.find((s) => s.id === 'A4')!.y,
    );

    // 1a. Single press + drag on unselected seat A4 must NOT select or move it
    fireNodeMouseDown(a4Node, startWorld.x + 10, startWorld.y + 10, { detail: 1 });
    fireWindowMouseMove(startWorld.x + 110, startWorld.y + 10);
    fireWindowMouseUp(startWorld.x + 110, startWorld.y + 10);
    expect(useSeatEditorStore.getState().selectedSeatIds.size).toBe(0);
    expect(useSeatEditorStore.getState().history).toHaveLength(0);

    // 1b. Double-click A4 to select it for drag-and-drop
    fireNodeDblClick(a4Node, startWorld.x + 10, startWorld.y + 10);
    expect(Array.from(useSeatEditorStore.getState().selectedSeatIds)).toEqual(['A4']);

    // 1c. Now press and drag the selected seat A4 +100px right (snaps to +90px = 3 pitches)
    fireNodeMouseDown(a4Node, startWorld.x + 10, startWorld.y + 10);
    fireWindowMouseMove(startWorld.x + 110, startWorld.y + 10);

    // While dragging before release, the Konva node follows the cursor freely (+100px)
    expect(a4Node.x()).toBeCloseTo(startWorld.x + 100, 1);

    fireWindowMouseUp(startWorld.x + 110, startWorld.y + 10);

    const state = useSeatEditorStore.getState();
    expect(state.history).toHaveLength(1);
    expect(selectIsDirty(state)).toBe(true);

    const movedA4 = state.seats.find((s) => s.id === 'A4')!;
    const movedWorld = normalizedToWorld(movedA4.x, movedA4.y);
    expect(movedWorld.x - startWorld.x).toBeCloseTo(90, 0); // 3 * 30px snapped
    expect(movedWorld.y - startWorld.y).toBeCloseTo(0, 0);

    // Every other seat is untouched
    for (const s of state.seats.filter((seat) => seat.id !== 'A4')) {
      const orig = seats.find((o) => o.id === s.id)!;
      expect(s.x).toBe(orig.x);
      expect(s.y).toBe(orig.y);
    }
  });

  it('2. Marquee select 12 seats, then press on a GAP inside the selection box and drag: all 12 move by the same dx/dy, selection preserved, one history entry', () => {
    const seats = makeGridSeats(['A', 'B', 'C'], 4); // 3 rows x 4 seats = 12 seats
    const { stage } = mountWith1xStage(seats, true);

    const bg = stage.findOne('.background')!;
    // Marquee around all 12 seats (world 150,110 to 300,220)
    fireNodeMouseDown(bg, 150, 110);
    fireWindowMouseMove(300, 220);
    fireWindowMouseUp(300, 220);

    expect(useSeatEditorStore.getState().selectedSeatIds.size).toBe(12);

    // Press on the selection box (simulating pressing on a 2px gap / aisle / padding inside the selection box)
    const selectionBoxNode = stage.findOne('.selection-box')!;
    expect(selectionBoxNode.listening()).toBe(true);
    expect(selectionBoxNode.visible()).toBe(true);

    // Gap between A1 (x: 160..188) and A2 (x: 190..218) is at x = 189
    fireNodeMouseDown(selectionBoxNode, 189, 130);
    // Drag +60px right (2 pitches) and +28px down (1 pitch)
    fireWindowMouseMove(189 + 60, 130 + 28);
    fireWindowMouseUp(189 + 60, 130 + 28);

    const state = useSeatEditorStore.getState();
    expect(state.selectedSeatIds.size).toBe(12);
    expect(state.history).toHaveLength(1);

    for (const updated of state.seats) {
      const orig = seats.find((s) => s.id === updated.id)!;
      const origW = normalizedToWorld(orig.x, orig.y);
      const nextW = normalizedToWorld(updated.x, updated.y);
      expect(nextW.x - origW.x).toBeCloseTo(60, 0);
      expect(nextW.y - origW.y).toBeCloseTo(28, 0);
    }
  });

  it('3. Shift-click 3 seats, then drag one of them: all 3 move', () => {
    const seats = makeGridSeats(['A', 'B'], 4);
    const { stage } = mountWith1xStage(seats, true);

    const a1 = stage.findOne('#A1')!;
    const a2 = stage.findOne('#A2')!;
    const a3 = stage.findOne('#A3')!;

    // Shift-click A1, A2, A3
    fireNodeMouseDown(a1, 165, 125, { shiftKey: true });
    fireWindowMouseUp(165, 125);
    fireNodeMouseDown(a2, 195, 125, { shiftKey: true });
    fireWindowMouseUp(195, 125);
    fireNodeMouseDown(a3, 225, 125, { shiftKey: true });
    fireWindowMouseUp(225, 125);

    expect(Array.from(useSeatEditorStore.getState().selectedSeatIds)).toEqual(['A1', 'A2', 'A3']);

    // Now press on A2 (without Shift) and drag +180px right (6 pitches, well clear of A4)
    fireNodeMouseDown(a2, 195, 125);
    fireWindowMouseMove(195 + 180, 125);
    fireWindowMouseUp(195 + 180, 125);

    const state = useSeatEditorStore.getState();
    expect(state.history).toHaveLength(1);
    for (const id of ['A1', 'A2', 'A3']) {
      const origW = normalizedToWorld(
        seats.find((s) => s.id === id)!.x,
        seats.find((s) => s.id === id)!.y,
      );
      const nextW = normalizedToWorld(
        state.seats.find((s) => s.id === id)!.x,
        state.seats.find((s) => s.id === id)!.y,
      );
      expect(nextW.x - origW.x).toBeCloseTo(180, 0);
    }
    // A4 did not move
    expect(state.seats.find((s) => s.id === 'A4')!.x).toBe(seats.find((s) => s.id === 'A4')!.x);
  });

  it('4. Click the row label of row B, then drag the label: the whole row moves', () => {
    const seats = makeGridSeats(['A', 'B'], 4);
    const { stage } = mountWith1xStage(seats, true);

    const rowBLabel = stage.findOne('#row-label-B-left')!;
    // Plain click on row B label selects the whole row B
    fireNodeMouseDown(rowBLabel, 130, 155);
    fireWindowMouseUp(130, 155);

    expect(Array.from(useSeatEditorStore.getState().selectedSeatIds)).toEqual([
      'B1',
      'B2',
      'B3',
      'B4',
    ]);

    // Now press on row B label and drag +60px right, +56px down
    fireNodeMouseDown(rowBLabel, 130, 155);
    fireWindowMouseMove(130 + 60, 155 + 56);
    fireWindowMouseUp(130 + 60, 155 + 56);

    const state = useSeatEditorStore.getState();
    expect(state.history).toHaveLength(1);

    for (const id of ['B1', 'B2', 'B3', 'B4']) {
      const origW = normalizedToWorld(
        seats.find((s) => s.id === id)!.x,
        seats.find((s) => s.id === id)!.y,
      );
      const nextW = normalizedToWorld(
        state.seats.find((s) => s.id === id)!.x,
        state.seats.find((s) => s.id === id)!.y,
      );
      expect(nextW.x - origW.x).toBeCloseTo(60, 0);
      expect(nextW.y - origW.y).toBeCloseTo(56, 0);
    }

    // Row A did not move
    for (const id of ['A1', 'A2', 'A3', 'A4']) {
      expect(state.seats.find((s) => s.id === id)!.x).toBe(seats.find((s) => s.id === id)!.x);
      expect(state.seats.find((s) => s.id === id)!.y).toBe(seats.find((s) => s.id === id)!.y);
    }
  });

  it('5. Drop onto an occupied slot: nothing changes, no history entry', () => {
    const seats = makeGridSeats(['A'], 2); // A1 at x=160, A2 at x=190
    const { stage } = mountWith1xStage(seats, true);

    const a1Node = stage.findOne('#A1')!;
    // Double-click A1 to select it, then drag +30px right directly onto A2's occupied slot (x=190)
    fireNodeDblClick(a1Node, 165, 125);
    fireNodeMouseDown(a1Node, 165, 125);
    fireWindowMouseMove(195, 125);
    fireWindowMouseUp(195, 125);

    const state = useSeatEditorStore.getState();
    expect(state.history).toHaveLength(0);
    expect(selectIsDirty(state)).toBe(false);
    expect(state.seats).toEqual(seats);
    // Konva node was restored to its original position (x=160)
    expect(a1Node.x()).toBeCloseTo(160, 0);
  });

  it('6. Undo restores the exact previous positions in a single step. Redo reapplies.', () => {
    const seats = makeGridSeats(['A', 'B'], 3);
    const { stage } = mountWith1xStage(seats, true);

    const rowBLabel = stage.findOne('#row-label-B-left')!;
    fireNodeMouseDown(rowBLabel, 130, 155);
    fireWindowMouseMove(130 + 90, 155 + 28);
    fireWindowMouseUp(130 + 90, 155 + 28);

    const movedSeats = useSeatEditorStore.getState().seats;
    expect(useSeatEditorStore.getState().history).toHaveLength(1);
    expect(movedSeats).not.toEqual(seats);

    // Undo in a single step
    act(() => {
      useSeatEditorStore.getState().undo();
    });
    expect(useSeatEditorStore.getState().seats).toEqual(seats);
    expect(selectIsDirty(useSeatEditorStore.getState())).toBe(false);

    // Redo reapplies
    act(() => {
      useSeatEditorStore.getState().redo();
    });
    expect(useSeatEditorStore.getState().seats).toEqual(movedSeats);
    expect(selectIsDirty(useSeatEditorStore.getState())).toBe(true);
  });

  it('7. Double-click selects a seat, and a drag shorter than 4px keeps selection without moving', () => {
    const seats = makeGridSeats(['A'], 2);
    const { stage } = mountWith1xStage(seats, true);

    const a2Node = stage.findOne('#A2')!;
    fireNodeDblClick(a2Node, 195, 125);
    // Move only 2.5px (< 4px threshold)
    fireNodeMouseDown(a2Node, 195, 125);
    fireWindowMouseMove(197, 126);
    fireWindowMouseUp(197, 126);

    const state = useSeatEditorStore.getState();
    expect(Array.from(state.selectedSeatIds)).toEqual(['A2']);
    expect(state.history).toHaveLength(0);
    expect(state.seats).toEqual(seats);
  });

  it('8. Pressing on empty canvas and releasing without drag clears the selection', () => {
    const seats = makeGridSeats(['A'], 3);
    const { stage } = mountWith1xStage(seats, true);

    act(() => {
      useSeatEditorStore.getState().selectAll();
    });
    expect(useSeatEditorStore.getState().selectedSeatIds.size).toBe(3);

    const bg = stage.findOne('.background')!;
    fireNodeMouseDown(bg, 50, 50);
    fireWindowMouseUp(50, 50);

    expect(useSeatEditorStore.getState().selectedSeatIds.size).toBe(0);
  });

  it('9. Drag a seat into the left padding area: it lands there, the box grows only if the seat passes the padding edge, and the screen keeps its gap', () => {
    // Place initial seats starting at x = 250 so the initial box left edge is 40 (BLOCK_ORIGIN.x - 120),
    // giving a left padding area from x = 40 to x = 250 (padding threshold at x = 160).
    const seats = makeGridSeats(['A', 'B'], 2, 250, 120);
    const { stage } = mountWith1xStage(seats, true);

    const initialFrame = computeLayoutFrame(
      useSeatEditorStore.getState().seats.map((s) => normalizedToWorld(s.x, s.y)),
    );
    expect(initialFrame.box.x).toBe(40);
    expect(initialFrame.screen.top - initialFrame.seatBounds.lastRowBottom).toBe(SCREEN_GAP);

    // 9a. Double-click A1 to select it, then drag left by 60px (from x=250 to x=190, inside the left padding area without passing the 120px edge at x=160)
    const a1Node = stage.findOne('#A1')!;
    fireNodeDblClick(a1Node, 255, 125);
    fireNodeMouseDown(a1Node, 255, 125);
    fireWindowMouseMove(195, 125);
    fireWindowMouseUp(195, 125);

    const midSeats = useSeatEditorStore.getState().seats;
    const midA1World = normalizedToWorld(
      midSeats.find((s) => s.id === 'A1')!.x,
      midSeats.find((s) => s.id === 'A1')!.y,
    );
    expect(midA1World.x).toBeCloseTo(190, 0);

    const midFrame = computeLayoutFrame(midSeats.map((s) => normalizedToWorld(s.x, s.y)));
    // Box did NOT grow because x=190 still has 150px (>= 120px) of left padding inside box.x=40
    expect(midFrame.box.x).toBe(40);
    expect(midFrame.box.width).toBe(initialFrame.box.width);
    expect(midFrame.screen.top - midFrame.seatBounds.lastRowBottom).toBe(SCREEN_GAP);

    // 9b. Now drag A1 further left by 90px (from x=190 to x=100, passing the 120px padding edge so box.x grows from 40 to 0)
    fireNodeMouseDown(a1Node, 195, 125);
    fireWindowMouseMove(105, 125);
    fireWindowMouseUp(105, 125);

    const finalSeats = useSeatEditorStore.getState().seats;
    const finalA1World = normalizedToWorld(
      finalSeats.find((s) => s.id === 'A1')!.x,
      finalSeats.find((s) => s.id === 'A1')!.y,
    );
    expect(finalA1World.x).toBeCloseTo(100, 0);

    const finalFrame = computeLayoutFrame(finalSeats.map((s) => normalizedToWorld(s.x, s.y)));
    expect(finalFrame.box.x).toBeLessThan(initialFrame.box.x);
    expect(finalFrame.box.width).toBeGreaterThan(initialFrame.box.width);
    expect(finalFrame.screen.top - finalFrame.seatBounds.lastRowBottom).toBe(SCREEN_GAP);
    expect(finalFrame.seatBounds.minX - finalFrame.box.x).toBeGreaterThanOrEqual(
      Math.min(LAYOUT_BOX_PADDING.left, finalFrame.seatBounds.minX),
    );
  });

  it('10. Generate the 4-section preset, open the editor: the gap between row R and the screen is at least SCREEN_GAP, and the first fit shows the box, screen and caption fully', () => {
    const preset = MULTI_SECTION_PRESETS.BMS_4_SECTION;
    const calculated = computeSectionLayoutPositions({
      sections: preset.sections,
      rows: preset.rows,
      verticalAisleSpacing: 2.0,
      horizontalAisleSpacing: 1.5,
    });

    const bmsSeats: Seat[] = calculated.map((p, idx) => ({
      id: `bms-${idx}`,
      screenId: 'sc-bms-fit',
      rowLabel: p.rowLabel,
      seatNumber: p.seatNumber,
      label: `${p.rowLabel}${p.seatNumber}`,
      x: p.nx,
      y: p.ny,
      rotation: 0,
      type: p.type,
      isActive: true,
    }));

    const containerWidth = 1280;
    const containerHeight = 800;

    act(() => {
      useSeatEditorStore.getState().initEditor('th-1', 'sc-bms-fit', 'Screen IMAX', bmsSeats);
    });

    render(<SeatCanvas containerWidth={containerWidth} containerHeight={containerHeight} />);

    const { zoom, pan, seats } = useSeatEditorStore.getState();
    const worldPoints = seats.map((s) => normalizedToWorld(s.x, s.y));
    const frame = computeLayoutFrame(worldPoints);

    // Row R is the last row
    const rowRSeats = seats.filter((s) => s.rowLabel === 'R');
    const rowRBottom =
      Math.max(...rowRSeats.map((s) => normalizedToWorld(s.x, s.y).y)) + SEAT_METRICS.height;

    expect(frame.screen.top - rowRBottom).toBeGreaterThanOrEqual(SCREEN_GAP);
    expect(frame.screen.top - rowRBottom).toBe(64);

    // Verify the initial fit-to-view keeps the entire layout box, screen, and caption within [0, containerWidth] x [0, containerHeight]
    const toScreenX = (wx: number) => wx * zoom + pan.x;
    const toScreenY = (wy: number) => wy * zoom + pan.y;

    expect(toScreenX(frame.box.x)).toBeGreaterThanOrEqual(-0.5);
    expect(toScreenY(frame.box.y)).toBeGreaterThanOrEqual(-0.5);
    expect(toScreenX(frame.box.x + frame.box.width)).toBeLessThanOrEqual(containerWidth + 0.5);
    expect(toScreenY(frame.box.y + frame.box.height)).toBeLessThanOrEqual(containerHeight + 0.5);
    expect(toScreenY(frame.screen.captionBottom)).toBeLessThanOrEqual(containerHeight + 0.5);
  });
});
