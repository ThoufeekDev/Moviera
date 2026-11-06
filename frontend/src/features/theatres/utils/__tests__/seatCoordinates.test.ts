import { describe, it, expect } from 'vitest';
import {
  clampDeltaToWorld,
  computeContentRect,
  computeCornerBounds,
  computeDragDeltas,
  computeFitView,
  computeLayoutFrame,
  cornerBoundsToBox,
  hasSeatOverlapConflict,
  normalizedToWorld,
  snapToSeatGrid,
  worldToNormalized,
} from '../seatCoordinates';
import {
  BLOCK_ORIGIN,
  LAYOUT_BOX_MIN_SIZE,
  LAYOUT_BOX_PADDING,
  SCREEN_GAP,
  SEAT_METRICS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  ZOOM_LIMITS,
} from '../seatMetrics';

describe('seatCoordinates utility', () => {
  it('uses a fixed world mapping that does not depend on seat count', () => {
    const world = normalizedToWorld(0.5, 0.25);
    expect(world.x).toBe(WORLD_WIDTH * 0.5);
    expect(world.y).toBe(WORLD_HEIGHT * 0.25);

    // One seat pitch is a constant normalized step
    const a = worldToNormalized(BLOCK_ORIGIN.x, BLOCK_ORIGIN.y);
    const b = worldToNormalized(BLOCK_ORIGIN.x + SEAT_METRICS.pitchX, BLOCK_ORIGIN.y + SEAT_METRICS.pitchY);
    expect(b.x - a.x).toBeCloseTo(SEAT_METRICS.pitchX / WORLD_WIDTH, 4);
    expect(b.y - a.y).toBeCloseTo(SEAT_METRICS.pitchY / WORLD_HEIGHT, 4);
  });

  it('reversibly converts normalized coordinates to world and back', () => {
    const testPoints = [
      { x: 0.1, y: 0.2 },
      { x: 0.5, y: 0.5 },
      { x: 0.85, y: 0.92 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ];

    for (const pt of testPoints) {
      const world = normalizedToWorld(pt.x, pt.y);
      const restored = worldToNormalized(world.x, world.y);

      expect(restored.x).toBeCloseTo(pt.x, 3);
      expect(restored.y).toBeCloseTo(pt.y, 3);
    }
  });

  it('clamps out-of-boundary values safely between 0 and 1', () => {
    expect(normalizedToWorld(-0.5, -0.2)).toEqual({ x: 0, y: 0 });
    expect(normalizedToWorld(1.5, 2)).toEqual({ x: WORLD_WIDTH, y: WORLD_HEIGHT });
    expect(worldToNormalized(-200, -100)).toEqual({ x: 0, y: 0 });
    expect(worldToNormalized(99999, 99999)).toEqual({ x: 1, y: 1 });
  });

  it('snaps to the seat pitch grid anchored at the block origin', () => {
    const snapped = snapToSeatGrid(BLOCK_ORIGIN.x + 44, BLOCK_ORIGIN.y + 20);
    expect(snapped.x).toBe(BLOCK_ORIGIN.x + SEAT_METRICS.pitchX);
    expect(snapped.y).toBe(BLOCK_ORIGIN.y + SEAT_METRICS.pitchY);

    const already = snapToSeatGrid(BLOCK_ORIGIN.x, BLOCK_ORIGIN.y);
    expect(already).toEqual({ x: BLOCK_ORIGIN.x, y: BLOCK_ORIGIN.y });
  });

  it('clamps a group move so no seat leaves the world', () => {
    const bounds = computeCornerBounds([
      { x: 100, y: 50 },
      { x: 400, y: 300 },
    ])!;

    expect(bounds).toEqual({ minX: 100, minY: 50, maxX: 400, maxY: 300 });

    const left = clampDeltaToWorld(bounds, -5000, -5000);
    expect(left).toEqual({ dx: -100, dy: -50 });

    const right = clampDeltaToWorld(bounds, 99999, 99999);
    expect(right.dx).toBe(WORLD_WIDTH - SEAT_METRICS.width - 400);
    expect(right.dy).toBe(WORLD_HEIGHT - SEAT_METRICS.height - 300);

    const inside = clampDeltaToWorld(bounds, 10, -10);
    expect(inside).toEqual({ dx: 10, dy: -10 });
  });

  it('returns null corner bounds and content rect for an empty selection', () => {
    expect(computeCornerBounds([])).toBeNull();
    expect(computeContentRect([])).toBeNull();
  });

  it('frames seats with room for labels, headers and the screen', () => {
    const rect = computeContentRect([
      { x: 200, y: 200 },
      { x: 500, y: 400 },
    ])!;

    expect(rect.minX).toBeLessThan(200);
    expect(rect.minY).toBeLessThan(200);
    expect(rect.maxX).toBeGreaterThan(500 + SEAT_METRICS.width);
    expect(rect.maxY).toBeGreaterThan(400 + SEAT_METRICS.height);
  });

  it('builds a box that hugs seat boxes plus padding', () => {
    const box = cornerBoundsToBox({ minX: 100, minY: 50, maxX: 400, maxY: 300 }, 24);
    expect(box).toEqual({
      x: 76,
      y: 26,
      width: 300 + SEAT_METRICS.width + 48,
      height: 250 + SEAT_METRICS.height + 48,
    });
  });

  it('fits a world rectangle into the container by scaling the stage only', () => {
    const rect = { minX: 100, minY: 100, maxX: 1100, maxY: 600 };
    const { zoom, pan } = computeFitView(rect, 500, 400);

    expect(zoom).toBeCloseTo(0.5, 5);
    // Rect center lands on the container center
    expect(pan.x + ((rect.minX + rect.maxX) / 2) * zoom).toBeCloseTo(250, 5);
    expect(pan.y + ((rect.minY + rect.maxY) / 2) * zoom).toBeCloseTo(200, 5);

    const huge = computeFitView({ minX: 0, minY: 0, maxX: 100000, maxY: 100000 }, 500, 400);
    expect(huge.zoom).toBe(ZOOM_LIMITS.min);
  });

  it('supports per-side padding in cornerBoundsToBox', () => {
    const box = cornerBoundsToBox(
      { minX: 200, minY: 150, maxX: 500, maxY: 350 },
      { top: 100, right: 120, bottom: 64, left: 120 },
    );
    expect(box).toEqual({
      x: 80,
      y: 50,
      width: 300 + SEAT_METRICS.width + 240,
      height: 200 + SEAT_METRICS.height + 164,
    });
  });

  describe('computeDragDeltas (free follow, snapped drop, Alt bypass, world clamping)', () => {
    const anchor = { x: BLOCK_ORIGIN.x, y: BLOCK_ORIGIN.y };
    const movedCorners = {
      minX: BLOCK_ORIGIN.x,
      minY: BLOCK_ORIGIN.y,
      maxX: BLOCK_ORIGIN.x + SEAT_METRICS.pitchX * 2,
      maxY: BLOCK_ORIGIN.y + SEAT_METRICS.pitchY,
    };

    it('returns exact free follow delta and grid-snapped commit delta when snapToGrid is true', () => {
      const res = computeDragDeltas({
        rawDx: 41, // 1.36 pitches -> free is 41, snapped is 30 (1 pitch)
        rawDy: 47, // 1.67 pitches -> free is 47, snapped is 56 (2 pitches)
        anchor,
        movedCorners,
        snapToGrid: true,
        altKey: false,
      });

      expect(res.shouldSnap).toBe(true);
      expect(res.freeDelta).toEqual({ dx: 41, dy: 47 });
      expect(res.snappedDelta).toEqual({
        dx: SEAT_METRICS.pitchX,
        dy: SEAT_METRICS.pitchY * 2,
      });
    });

    it('bypasses grid snapping when Alt key is held', () => {
      const res = computeDragDeltas({
        rawDx: 41,
        rawDy: 47,
        anchor,
        movedCorners,
        snapToGrid: true,
        altKey: true,
      });

      expect(res.shouldSnap).toBe(false);
      expect(res.freeDelta).toEqual({ dx: 41, dy: 47 });
      expect(res.snappedDelta).toEqual({ dx: 41, dy: 47 });
    });

    it('clamps both free and snapped deltas at world bounds', () => {
      const resLeft = computeDragDeltas({
        rawDx: -5000,
        rawDy: -5000,
        anchor,
        movedCorners,
        snapToGrid: true,
      });

      expect(resLeft.freeDelta).toEqual({ dx: -BLOCK_ORIGIN.x, dy: -BLOCK_ORIGIN.y });
      expect(anchor.x + resLeft.snappedDelta.dx).toBeGreaterThanOrEqual(0);
      expect(anchor.y + resLeft.snappedDelta.dy).toBeGreaterThanOrEqual(0);

      const resRight = computeDragDeltas({
        rawDx: 99999,
        rawDy: 99999,
        anchor,
        movedCorners,
        snapToGrid: true,
      });

      expect(movedCorners.maxX + resRight.freeDelta.dx + SEAT_METRICS.width).toBeLessThanOrEqual(
        WORLD_WIDTH,
      );
      expect(movedCorners.maxY + resRight.freeDelta.dy + SEAT_METRICS.height).toBeLessThanOrEqual(
        WORLD_HEIGHT,
      );
    });
  });

  describe('hasSeatOverlapConflict', () => {
    const staticSeats = [
      { x: 160, y: 120 },
      { x: 190, y: 120 },
    ];

    it('detects a conflict when a dragged group lands on an occupied slot', () => {
      const movedOntoOccupied = [
        { x: 190, y: 120 }, // Exact slot of static seat 2
        { x: 220, y: 120 },
      ];
      expect(hasSeatOverlapConflict(movedOntoOccupied, staticSeats)).toBe(true);

      const partialOverlap = [{ x: 175, y: 130 }]; // Partially overlaps both (width 28, height 24)
      expect(hasSeatOverlapConflict(partialOverlap, staticSeats)).toBe(true);
    });

    it('returns false when the dragged group lands on free slots', () => {
      const movedOntoFree = [
        { x: 220, y: 120 }, // Next pitch slot (30px away from 190, width is 28px)
        { x: 250, y: 120 },
      ];
      expect(hasSeatOverlapConflict(movedOntoFree, staticSeats)).toBe(false);
    });

    it('never conflicts moving seats against themselves', () => {
      // Static list excludes the moving seats; even if two moving seats are adjacent, static is empty
      const movingGroup = [
        { x: 160, y: 120 },
        { x: 190, y: 120 },
      ];
      expect(hasSeatOverlapConflict(movingGroup, [])).toBe(false);
    });
  });

  describe('computeLayoutFrame (pure layout box and screen geometry)', () => {
    it('enforces SCREEN_GAP, encloses screen & caption, respects per-side padding & LAYOUT_BOX_MIN_SIZE, and stays in world', () => {
      const smallLayout = [
        { x: 160, y: 120 },
        { x: 190, y: 120 },
        { x: 160, y: 148 },
        { x: 190, y: 148 },
      ];

      const frame = computeLayoutFrame(smallLayout);
      const lastRowBottom = 148 + SEAT_METRICS.height;

      // 1. screen.top - lastRowBottom >= SCREEN_GAP
      expect(frame.screen.top - lastRowBottom).toBeGreaterThanOrEqual(SCREEN_GAP);
      expect(frame.screen.top - lastRowBottom).toBe(SCREEN_GAP);

      // 2. Box contains the screen and the caption
      const screenLeft = frame.screen.centerX - frame.screen.topWidth / 2;
      const screenRight = frame.screen.centerX + frame.screen.topWidth / 2;
      expect(frame.box.x).toBeLessThanOrEqual(screenLeft);
      expect(frame.box.x + frame.box.width).toBeGreaterThanOrEqual(screenRight);
      expect(frame.box.y).toBeLessThanOrEqual(frame.screen.top);
      expect(frame.box.y + frame.box.height).toBeGreaterThanOrEqual(frame.screen.captionBottom);

      // 3. Every side padding is at least LAYOUT_BOX_PADDING (unless clamped by the world)
      expect(frame.seatBounds.minX - frame.box.x).toBeGreaterThanOrEqual(LAYOUT_BOX_PADDING.left);
      expect(frame.box.x + frame.box.width - frame.seatBounds.maxX).toBeGreaterThanOrEqual(
        LAYOUT_BOX_PADDING.right,
      );
      expect(frame.seatBounds.minY - frame.box.y).toBeGreaterThanOrEqual(LAYOUT_BOX_PADDING.top);
      expect(frame.box.y + frame.box.height - frame.screen.captionBottom).toBeGreaterThanOrEqual(
        LAYOUT_BOX_PADDING.bottom,
      );

      // 4. Box is at least LAYOUT_BOX_MIN_SIZE
      expect(frame.box.width).toBeGreaterThanOrEqual(LAYOUT_BOX_MIN_SIZE.width);
      expect(frame.box.height).toBeGreaterThanOrEqual(LAYOUT_BOX_MIN_SIZE.height);

      // 5. Box stays inside the world
      expect(frame.box.x).toBeGreaterThanOrEqual(0);
      expect(frame.box.y).toBeGreaterThanOrEqual(0);
      expect(frame.box.x + frame.box.width).toBeLessThanOrEqual(WORLD_WIDTH);
      expect(frame.box.y + frame.box.height).toBeLessThanOrEqual(WORLD_HEIGHT);

      // 6. Moving the last row down moves the screen down by the exact same amount
      const movedDownLayout = [
        { x: 160, y: 120 },
        { x: 190, y: 120 },
        { x: 160, y: 148 + 84 },
        { x: 190, y: 148 + 84 },
      ];
      const movedFrame = computeLayoutFrame(movedDownLayout);
      expect(movedFrame.screen.top - frame.screen.top).toBe(84);
      expect(movedFrame.screen.captionBottom - frame.screen.captionBottom).toBe(84);
    });

    it('clamps the box edge to the world without moving seats when seats are near world boundaries', () => {
      const edgeSeats = [
        { x: 10, y: 10 },
        { x: WORLD_WIDTH - SEAT_METRICS.width - 10, y: WORLD_HEIGHT - SEAT_METRICS.height - 20 },
      ];

      const frame = computeLayoutFrame(edgeSeats);
      expect(frame.box.x).toBe(0);
      expect(frame.box.y).toBe(0);
      expect(frame.box.x + frame.box.width).toBe(WORLD_WIDTH);
      expect(frame.box.y + frame.box.height).toBe(WORLD_HEIGHT);
      expect(frame.seatBounds.minX).toBe(10);
      expect(frame.seatBounds.minY).toBe(10);
    });
  });
});
