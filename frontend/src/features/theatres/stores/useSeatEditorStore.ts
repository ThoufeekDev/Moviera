import { create } from 'zustand';
import type { Seat, SeatType } from '../types/seat.types';
import { SEAT_METRICS, WORLD_HEIGHT, WORLD_WIDTH, ZOOM_LIMITS } from '../utils/seatMetrics';

export interface SeatEditorState {
  theatreId: string | null;
  screenId: string | null;
  screenName: string;
  initialSeats: Seat[];
  seats: Seat[];
  selectedSeatIds: Set<string>;
  zoom: number;
  pan: { x: number; y: number };
  history: Seat[][];
  future: Seat[][];

  // Actions
  initEditor: (
    theatreId: string,
    screenId: string,
    screenName: string,
    seats: Seat[],
  ) => void;
  selectSeat: (id: string, multi?: boolean) => void;
  selectMultiple: (ids: string[], append?: boolean) => void;
  selectRow: (rowLabel: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  updateSeatPosition: (id: string, x: number, y: number) => void;
  batchUpdatePositions: (updates: Array<{ id: string; x: number; y: number }>) => void;
  insertSeatGap: (direction: 1 | -1) => void;
  insertRowGap: (direction: 1 | -1) => void;
  nudgeSelectedGrid: (stepX: number, stepY: number) => void;
  moveRow: (rowLabel: string, deltaX: number, deltaY: number) => void;
  nudgeSelected: (dx: number, dy: number) => void;
  rotateSelected: (deltaDeg: number) => void;
  updateSelectedProperties: (props: { type?: SeatType; isActive?: boolean }) => void;
  alignSelected: (direction: 'horizontal' | 'vertical') => void;
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  resetToBaseline: () => void;
  markSaved: (savedSeats: Seat[]) => void;
}

const areSeatsDirty = (initial: Seat[], current: Seat[]): boolean => {
  if (initial.length !== current.length) return true;

  const initialMap = new Map(initial.map((s) => [s.id, s]));

  for (const s of current) {
    const init = initialMap.get(s.id);
    if (!init) return true;

    // Check positions with high precision tolerance
    if (Math.abs(init.x - s.x) > 0.0001 || Math.abs(init.y - s.y) > 0.0001) {
      return true;
    }
    if (init.rotation !== s.rotation || init.type !== s.type || init.isActive !== s.isActive) {
      return true;
    }
  }

  return false;
};

export const useSeatEditorStore = create<SeatEditorState>((set, get) => ({
  theatreId: null,
  screenId: null,
  screenName: '',
  initialSeats: [],
  seats: [],
  selectedSeatIds: new Set<string>(),
  zoom: 1,
  pan: { x: 0, y: 0 },
  history: [],
  future: [],

  initEditor: (theatreId, screenId, screenName, seats) => {
    set({
      theatreId,
      screenId,
      screenName,
      initialSeats: [...seats],
      seats: [...seats],
      selectedSeatIds: new Set<string>(),
      zoom: 1,
      pan: { x: 0, y: 0 },
      history: [],
      future: [],
    });
  },

  selectSeat: (id, multi = false) => {
    const current = new Set(get().selectedSeatIds);
    if (multi) {
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      set({ selectedSeatIds: current });
    } else {
      set({ selectedSeatIds: new Set([id]) });
    }
  },

  selectMultiple: (ids, append = false) => {
    const current = append ? new Set(get().selectedSeatIds) : new Set<string>();
    for (const id of ids) {
      current.add(id);
    }
    set({ selectedSeatIds: current });
  },

  selectRow: (rowLabel) => {
    const rowSeats = get()
      .seats.filter((s) => s.rowLabel === rowLabel)
      .map((s) => s.id);
    set({ selectedSeatIds: new Set(rowSeats) });
  },

  selectAll: () => {
    set({ selectedSeatIds: new Set(get().seats.map((s) => s.id)) });
  },

  clearSelection: () => {
    set({ selectedSeatIds: new Set<string>() });
  },

  updateSeatPosition: (id, x, y) => {
    const { seats, history } = get();
    const nextSeats = seats.map((s) =>
      s.id === id ? { ...s, x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) } : s,
    );
    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  batchUpdatePositions: (updates) => {
    const { seats, history } = get();
    const updateMap = new Map(updates.map((u) => [u.id, u]));

    const nextSeats = seats.map((s) => {
      const u = updateMap.get(s.id);
      if (!u) return s;
      return {
        ...s,
        x: Math.max(0, Math.min(1, u.x)),
        y: Math.max(0, Math.min(1, u.y)),
      };
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  insertSeatGap: (direction) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size === 0) return;

    // Find the minimum X per row among selected seats in that row
    const selectedSeats = seats.filter((s) => selectedSeatIds.has(s.id));
    const rowMinX = new Map<string, number>();
    for (const s of selectedSeats) {
      const currentMin = rowMinX.get(s.rowLabel);
      if (currentMin === undefined || s.x < currentMin) {
        rowMinX.set(s.rowLabel, s.x);
      }
    }

    const deltaX = (direction * SEAT_METRICS.pitchX) / WORLD_WIDTH;

    // Shift selected seats and all downstream seats to their right in the same row
    const nextSeats = seats.map((s) => {
      const minX = rowMinX.get(s.rowLabel);
      if (minX !== undefined && s.x >= minX - 0.0001) {
        return {
          ...s,
          x: Math.max(0, Math.min(1, Math.round((s.x + deltaX) * 10000) / 10000)),
        };
      }
      return s;
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  insertRowGap: (direction) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size === 0) return;

    const selectedSeats = seats.filter((s) => selectedSeatIds.has(s.id));
    const maxY = Math.max(...selectedSeats.map((s) => s.y));
    const deltaY = (direction * SEAT_METRICS.pitchY) / WORLD_HEIGHT;

    // Push all rows strictly below the selected row down/up by one row pitch
    const nextSeats = seats.map((s) => {
      if (s.y > maxY + 0.001) {
        return {
          ...s,
          y: Math.max(0, Math.min(1, Math.round((s.y + deltaY) * 10000) / 10000)),
        };
      }
      return s;
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  nudgeSelectedGrid: (stepX, stepY) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size === 0) return;

    const deltaX = (stepX * SEAT_METRICS.pitchX) / WORLD_WIDTH;
    const deltaY = (stepY * SEAT_METRICS.pitchY) / WORLD_HEIGHT;

    const nextSeats = seats.map((s) => {
      if (!selectedSeatIds.has(s.id)) return s;
      return {
        ...s,
        x: Math.max(0, Math.min(1, Math.round((s.x + deltaX) * 10000) / 10000)),
        y: Math.max(0, Math.min(1, Math.round((s.y + deltaY) * 10000) / 10000)),
      };
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  moveRow: (rowLabel, deltaX, deltaY) => {
    const { seats, history } = get();
    const nextSeats = seats.map((s) => {
      if (s.rowLabel.trim().toUpperCase() !== rowLabel.trim().toUpperCase()) return s;
      return {
        ...s,
        x: Math.max(0, Math.min(1, Math.round((s.x + deltaX) * 10000) / 10000)),
        y: Math.max(0, Math.min(1, Math.round((s.y + deltaY) * 10000) / 10000)),
      };
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  nudgeSelected: (dx, dy) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size === 0) return;

    const nextSeats = seats.map((s) => {
      if (!selectedSeatIds.has(s.id)) return s;
      return {
        ...s,
        x: Math.max(0, Math.min(1, Math.round((s.x + dx) * 10000) / 10000)),
        y: Math.max(0, Math.min(1, Math.round((s.y + dy) * 10000) / 10000)),
      };
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  rotateSelected: (deltaDeg) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size === 0) return;

    const nextSeats = seats.map((s) => {
      if (!selectedSeatIds.has(s.id)) return s;
      const nextRotation = (s.rotation + deltaDeg) % 360;
      return {
        ...s,
        rotation: nextRotation < 0 ? nextRotation + 360 : nextRotation,
      };
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  updateSelectedProperties: (props) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size === 0) return;

    const nextSeats = seats.map((s) => {
      if (!selectedSeatIds.has(s.id)) return s;
      return {
        ...s,
        ...(props.type ? { type: props.type } : {}),
        ...(typeof props.isActive === 'boolean' ? { isActive: props.isActive } : {}),
      };
    });

    set({
      history: [...history.slice(-19), seats],
      future: [],
      seats: nextSeats,
    });
  },

  alignSelected: (direction) => {
    const { seats, selectedSeatIds, history } = get();
    if (selectedSeatIds.size <= 1) return;

    const selected = seats.filter((s) => selectedSeatIds.has(s.id));
    if (selected.length <= 1) return;

    if (direction === 'horizontal') {
      // Align all Y coordinates to the average Y
      const avgY = selected.reduce((sum, s) => sum + s.y, 0) / selected.length;
      const nextSeats = seats.map((s) =>
        selectedSeatIds.has(s.id) ? { ...s, y: Math.round(avgY * 10000) / 10000 } : s,
      );
      set({
        history: [...history.slice(-19), seats],
        future: [],
        seats: nextSeats,
      });
    } else {
      // Align all X coordinates to the average X
      const avgX = selected.reduce((sum, s) => sum + s.x, 0) / selected.length;
      const nextSeats = seats.map((s) =>
        selectedSeatIds.has(s.id) ? { ...s, x: Math.round(avgX * 10000) / 10000 } : s,
      );
      set({
        history: [...history.slice(-19), seats],
        future: [],
        seats: nextSeats,
      });
    }
  },

  undo: () => {
    const { history, seats, future } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    set({
      history: history.slice(0, -1),
      future: [seats, ...future.slice(0, 19)],
      seats: previous,
    });
  },

  redo: () => {
    const { future, seats, history } = get();
    if (future.length === 0) return;

    const next = future[0];
    set({
      future: future.slice(1),
      history: [...history.slice(-19), seats],
      seats: next,
    });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(ZOOM_LIMITS.min, Math.min(ZOOM_LIMITS.max, zoom)) });
  },

  setPan: (pan) => {
    set({ pan });
  },

  resetToBaseline: () => {
    const { initialSeats } = get();
    set({
      seats: [...initialSeats],
      history: [],
      future: [],
      selectedSeatIds: new Set<string>(),
    });
  },

  markSaved: (savedSeats) => {
    set({
      initialSeats: [...savedSeats],
      seats: [...savedSeats],
      history: [],
      future: [],
    });
  },
}));

// Selector for dirty status
export const selectIsDirty = (state: SeatEditorState): boolean =>
  areSeatsDirty(state.initialSeats, state.seats);

