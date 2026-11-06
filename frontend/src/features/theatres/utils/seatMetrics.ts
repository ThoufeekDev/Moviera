/**
 * Single source of truth for seat geometry and the world <-> normalized mapping.
 *
 * Seat geometry (world pixels, before stage zoom):
 *   - Seat box: 28 x 24 px.
 *   - Horizontal pitch 30 px (2 px gap), vertical pitch 28 px (4 px gap).
 *   Zoom and fit-to-view scale the whole stage; they never change these values.
 *
 * Normalized <-> world mapping (what the backend stores as seat `x` / `y` in [0, 1]):
 *   worldX = x * WORLD_WIDTH        x = worldX / WORLD_WIDTH
 *   worldY = y * WORLD_HEIGHT       y = worldY / WORLD_HEIGHT
 *   `x` / `y` are the seat's top-left corner. The mapping is a fixed constant, so it never
 *   depends on how many seats or rows a screen has: adding seats cannot change spacing.
 *   One seat pitch is 0.01 in x and 0.014 in y.
 *   Capacity of the world: 100 seat slots per row and 71 rows.
 */
export const SEAT_METRICS = {
  width: 28,
  height: 24,
  pitchX: 30,
  pitchY: 28,
  cornerRadius: 4,
} as const;

export const WORLD_WIDTH = 3000;
export const WORLD_HEIGHT = 2000;

/** Top-left world position of the first seat of a freshly generated block. */
export const BLOCK_ORIGIN = { x: 160, y: 120 } as const;

export const ZOOM_LIMITS = { min: 0.2, max: 2.5 } as const;

/** Minimum pointer travel (screen px) before a mouse press on a seat becomes a drag. */
export const DRAG_THRESHOLD_PX = 4;

/** Minimum allowed and default vertical gap (world px) from the bottom of the last seat row to the top of the screen. */
export const MIN_SCREEN_GAP = 48;
export const SCREEN_GAP = 64;

/** Per-side padding (world px) around the seats and below the screen caption inside the layout box. */
export const LAYOUT_BOX_PADDING = {
  top: 100,
  right: 120,
  bottom: 64,
  left: 120,
} as const;

/** Minimum size (world px) of the layout box so small layouts still have room to add or move seats. */
export const LAYOUT_BOX_MIN_SIZE = {
  width: 1200,
  height: 700,
} as const;

