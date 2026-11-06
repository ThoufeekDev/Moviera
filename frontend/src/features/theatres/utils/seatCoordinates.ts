import {
  BLOCK_ORIGIN,
  LAYOUT_BOX_MIN_SIZE,
  LAYOUT_BOX_PADDING,
  MIN_SCREEN_GAP,
  SCREEN_GAP,
  SEAT_METRICS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  ZOOM_LIMITS,
} from './seatMetrics';

export interface WorldRect {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface BoxPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ScreenGeometry {
  centerX: number;
  top: number;
  bottom: number;
  topWidth: number;
  bottomWidth: number;
  height: number;
  points: number[];
  highlightPoints: number[];
  captionY: number;
  captionBottom: number;
}

export interface LayoutFrame {
  seatBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
    lastRowBottom: number;
  };
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  screen: ScreenGeometry;
}

const SCREEN_HEIGHT_PX = 16;
const SCREEN_CAPTION_OFFSET_Y = 12;
const SCREEN_CAPTION_HEIGHT_PX = 14;
const MIN_SCREEN_TOP_WIDTH = 340;

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Normalized [0, 1] -> world pixels using the fixed world size (see seatMetrics.ts). */
export function normalizedToWorld(x: number, y: number): { x: number; y: number } {
  return {
    x: clamp(x, 0, 1) * WORLD_WIDTH,
    y: clamp(y, 0, 1) * WORLD_HEIGHT,
  };
}

/** World pixels -> normalized [0, 1] rounded to 4 decimals (<= 0.15 px of error). */
export function worldToNormalized(worldX: number, worldY: number): { x: number; y: number } {
  return {
    x: Math.round(clamp(worldX / WORLD_WIDTH, 0, 1) * 10000) / 10000,
    y: Math.round(clamp(worldY / WORLD_HEIGHT, 0, 1) * 10000) / 10000,
  };
}

/** Snaps a seat's top-left world position to the seat-pitch grid anchored at BLOCK_ORIGIN. */
export function snapToSeatGrid(worldX: number, worldY: number): { x: number; y: number } {
  return {
    x: BLOCK_ORIGIN.x + Math.round((worldX - BLOCK_ORIGIN.x) / SEAT_METRICS.pitchX) * SEAT_METRICS.pitchX,
    y: BLOCK_ORIGIN.y + Math.round((worldY - BLOCK_ORIGIN.y) / SEAT_METRICS.pitchY) * SEAT_METRICS.pitchY,
  };
}

/**
 * Limits a move delta so a group of seats (given by the bounds of their top-left
 * corners) keeps every seat box fully inside the world.
 */
export function clampDeltaToWorld(
  cornerBounds: WorldRect,
  dx: number,
  dy: number,
): { dx: number; dy: number } {
  return {
    dx: clamp(dx, -cornerBounds.minX, WORLD_WIDTH - SEAT_METRICS.width - cornerBounds.maxX),
    dy: clamp(dy, -cornerBounds.minY, WORLD_HEIGHT - SEAT_METRICS.height - cornerBounds.maxY),
  };
}

/**
 * Computes both the free cursor-following delta and the commit/target delta (snapped
 * to the BLOCK_ORIGIN grid by the dragged anchor seat unless snap is off or Alt is held),
 * clamped so no seat in the group leaves the world.
 */
export function computeDragDeltas(options: {
  rawDx: number;
  rawDy: number;
  anchor: { x: number; y: number };
  movedCorners: WorldRect;
  snapToGrid: boolean;
  altKey?: boolean;
}): {
  freeDelta: { dx: number; dy: number };
  snappedDelta: { dx: number; dy: number };
  shouldSnap: boolean;
} {
  const { rawDx, rawDy, anchor, movedCorners, snapToGrid, altKey = false } = options;
  const freeDelta = clampDeltaToWorld(movedCorners, rawDx, rawDy);
  const shouldSnap = snapToGrid && !altKey;

  if (!shouldSnap) {
    return {
      freeDelta,
      snappedDelta: freeDelta,
      shouldSnap: false,
    };
  }

  const snappedAnchor = snapToSeatGrid(anchor.x + freeDelta.dx, anchor.y + freeDelta.dy);
  const rawSnapDx = snappedAnchor.x - anchor.x;
  const rawSnapDy = snappedAnchor.y - anchor.y;
  const snappedDelta = clampDeltaToWorld(movedCorners, rawSnapDx, rawSnapDy);

  return {
    freeDelta,
    snappedDelta,
    shouldSnap: true,
  };
}

/**
 * Returns true if any moved seat bounding box intersects any non-moving (static) seat
 * bounding box. Seats within the moving group are never compared against each other.
 */
export function hasSeatOverlapConflict(
  movedPositions: ReadonlyArray<{ x: number; y: number }>,
  staticPositions: ReadonlyArray<{ x: number; y: number }>,
): boolean {
  const w = SEAT_METRICS.width - 0.01;
  const h = SEAT_METRICS.height - 0.01;

  for (const moved of movedPositions) {
    for (const stat of staticPositions) {
      if (Math.abs(moved.x - stat.x) < w && Math.abs(moved.y - stat.y) < h) {
        return true;
      }
    }
  }
  return false;
}

/** Bounds of seat top-left corners in world pixels. Returns null for an empty list. */
export function computeCornerBounds(points: Array<{ x: number; y: number }>): WorldRect | null {
  if (points.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Rectangle (x, y, width, height) that frames seat boxes whose top-left corners are in `corners`.
 * Accepts either a uniform numeric padding or per-side `{ top, right, bottom, left }` padding.
 */
export function cornerBoundsToBox(
  corners: WorldRect,
  padding: number | BoxPadding,
): { x: number; y: number; width: number; height: number } {
  const p: BoxPadding =
    typeof padding === 'number'
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : padding;

  return {
    x: corners.minX - p.left,
    y: corners.minY - p.top,
    width: corners.maxX - corners.minX + SEAT_METRICS.width + p.left + p.right,
    height: corners.maxY - corners.minY + SEAT_METRICS.height + p.top + p.bottom,
  };
}

/**
 * Computes the complete layout frame (seat bounds, screen + caption geometry, and the
 * clamped layout box with per-side padding and minimum working area) from seat top-left corners.
 */
export function computeLayoutFrameFromCorners(
  corners: WorldRect | null,
  padding: BoxPadding = LAYOUT_BOX_PADDING,
  minSize: { width: number; height: number } = LAYOUT_BOX_MIN_SIZE,
  screenGap: number = SCREEN_GAP,
): LayoutFrame {
  const effectiveCorners: WorldRect = corners ?? {
    minX: BLOCK_ORIGIN.x,
    minY: BLOCK_ORIGIN.y,
    maxX: BLOCK_ORIGIN.x + SEAT_METRICS.pitchX * 10,
    maxY: BLOCK_ORIGIN.y + SEAT_METRICS.pitchY * 5,
  };

  const seatMinX = effectiveCorners.minX;
  const seatMinY = effectiveCorners.minY;
  const seatMaxX = effectiveCorners.maxX + SEAT_METRICS.width;
  const lastRowBottom = effectiveCorners.maxY + SEAT_METRICS.height;
  const seatWidth = Math.max(seatMaxX - seatMinX, SEAT_METRICS.width);
  const seatHeight = Math.max(lastRowBottom - seatMinY, SEAT_METRICS.height);

  const effectiveGap = Math.max(screenGap, MIN_SCREEN_GAP);
  const screenTop = lastRowBottom + effectiveGap;
  const screenBottom = screenTop + SCREEN_HEIGHT_PX;
  const centerX = seatMinX + seatWidth / 2;
  const topWidth = Math.max(seatWidth * 0.55, MIN_SCREEN_TOP_WIDTH);
  const bottomWidth = topWidth * 0.88;
  const captionY = screenBottom + SCREEN_CAPTION_OFFSET_Y;
  const captionBottom = captionY + SCREEN_CAPTION_HEIGHT_PX;

  const screen: ScreenGeometry = {
    centerX,
    top: screenTop,
    bottom: screenBottom,
    topWidth,
    bottomWidth,
    height: SCREEN_HEIGHT_PX,
    points: [
      centerX - topWidth / 2,
      screenTop,
      centerX + topWidth / 2,
      screenTop,
      centerX + bottomWidth / 2,
      screenBottom,
      centerX - bottomWidth / 2,
      screenBottom,
    ],
    highlightPoints: [
      centerX - topWidth / 2 + 16,
      screenTop + 3,
      centerX + topWidth / 2 - 16,
      screenTop + 3,
    ],
    captionY,
    captionBottom,
  };

  // Baseline working box anchored around BLOCK_ORIGIN so small layouts have a stable large canvas
  const baselineLeft = Math.max(0, BLOCK_ORIGIN.x - padding.left);
  const baselineTop = Math.max(0, BLOCK_ORIGIN.y - padding.top);
  const baselineRight = Math.min(WORLD_WIDTH, baselineLeft + minSize.width);
  const baselineBottom = Math.min(WORLD_HEIGHT, baselineTop + minSize.height);

  const contentLeft = Math.min(seatMinX - padding.left, centerX - topWidth / 2 - 24);
  const contentRight = Math.max(seatMaxX + padding.right, centerX + topWidth / 2 + 24);
  const contentTop = seatMinY - padding.top;
  const contentBottom = captionBottom + padding.bottom;

  let boxLeft = Math.min(baselineLeft, contentLeft);
  let boxRight = Math.max(baselineRight, contentRight);
  let boxTop = Math.min(baselineTop, contentTop);
  let boxBottom = Math.max(baselineBottom, contentBottom);

  // Ensure minimum size before clamping to world
  if (boxRight - boxLeft < minSize.width) {
    boxRight = boxLeft + minSize.width;
  }
  if (boxBottom - boxTop < minSize.height) {
    boxBottom = boxTop + minSize.height;
  }

  // Clamp to world bounds without moving seats
  if (boxLeft < 0) {
    boxLeft = 0;
    boxRight = Math.max(boxRight, Math.min(WORLD_WIDTH, minSize.width));
  }
  if (boxRight > WORLD_WIDTH) {
    boxRight = WORLD_WIDTH;
    boxLeft = Math.min(boxLeft, Math.max(0, WORLD_WIDTH - minSize.width));
  }
  boxLeft = clamp(boxLeft, 0, WORLD_WIDTH);
  boxRight = clamp(boxRight, boxLeft, WORLD_WIDTH);

  if (boxTop < 0) {
    boxTop = 0;
    boxBottom = Math.max(boxBottom, Math.min(WORLD_HEIGHT, minSize.height));
  }
  if (boxBottom > WORLD_HEIGHT) {
    boxBottom = WORLD_HEIGHT;
    boxTop = Math.min(boxTop, Math.max(0, WORLD_HEIGHT - minSize.height));
  }
  boxTop = clamp(boxTop, 0, WORLD_HEIGHT);
  boxBottom = clamp(boxBottom, boxTop, WORLD_HEIGHT);

  return {
    seatBounds: {
      minX: seatMinX,
      minY: seatMinY,
      maxX: seatMaxX,
      maxY: lastRowBottom,
      width: seatWidth,
      height: seatHeight,
      lastRowBottom,
    },
    box: {
      x: boxLeft,
      y: boxTop,
      width: boxRight - boxLeft,
      height: boxBottom - boxTop,
    },
    screen,
  };
}

/**
 * Pure layout frame helper: given seat top-left world positions, returns the layout box and screen geometry.
 */
export function computeLayoutFrame(
  points: Array<{ x: number; y: number }>,
  padding: BoxPadding = LAYOUT_BOX_PADDING,
  minSize: { width: number; height: number } = LAYOUT_BOX_MIN_SIZE,
  screenGap: number = SCREEN_GAP,
): LayoutFrame {
  return computeLayoutFrameFromCorners(computeCornerBounds(points), padding, minSize, screenGap);
}

/**
 * World rectangle that frames the whole layout box, screen, and caption for fit-to-view.
 */
export function computeContentRect(points: Array<{ x: number; y: number }>): WorldRect | null {
  const corners = computeCornerBounds(points);
  if (!corners) return null;

  const frame = computeLayoutFrameFromCorners(corners);
  return {
    minX: frame.box.x,
    minY: frame.box.y,
    maxX: frame.box.x + frame.box.width,
    maxY: Math.max(frame.box.y + frame.box.height, frame.screen.captionBottom),
  };
}

/**
 * Zoom and pan that fit a world rectangle inside the container.
 * Scales the stage only; seat spacing is untouched.
 */
export function computeFitView(
  rect: WorldRect,
  containerWidth: number,
  containerHeight: number,
  maxFitZoom = 1.5,
): { zoom: number; pan: { x: number; y: number } } {
  const width = Math.max(rect.maxX - rect.minX, 1);
  const height = Math.max(rect.maxY - rect.minY, 1);
  const zoom = clamp(
    Math.min(containerWidth / width, containerHeight / height),
    ZOOM_LIMITS.min,
    maxFitZoom,
  );

  return {
    zoom,
    pan: {
      x: (containerWidth - width * zoom) / 2 - rect.minX * zoom,
      y: (containerHeight - height * zoom) / 2 - rect.minY * zoom,
    },
  };
}
