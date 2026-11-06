import { useCallback, useEffect, useRef, type RefObject } from 'react';
import Konva from 'konva';
import { useSeatEditorStore } from '../stores/useSeatEditorStore';
import {
  computeCornerBounds,
  computeDragDeltas,
  computeLayoutFrameFromCorners,
  cornerBoundsToBox,
  hasSeatOverlapConflict,
  normalizedToWorld,
  worldToNormalized,
  type WorldRect,
} from '../utils/seatCoordinates';
import {
  DRAG_THRESHOLD_PX,
  LAYOUT_BOX_PADDING,
  SEAT_METRICS,
  ZOOM_LIMITS,
} from '../utils/seatMetrics';
import { SELECTION_THEME } from '../utils/seatTheme';

export { LAYOUT_BOX_PADDING };

const DOUBLE_CLICK_WINDOW_MS = 350;

interface PendingSeatPress {
  kind: 'pending';
  seatId: string;
  startClientX: number;
  startClientY: number;
  modifier: boolean;
  wasInSelection: boolean;
  collapseOnClick: boolean;
}

interface SeatDrag {
  kind: 'drag';
  seatId: string;
  startClientX: number;
  startClientY: number;
  /** Start world position of every moved seat, captured once on drag start. */
  starts: Map<string, { x: number; y: number }>;
  staticPoints: Array<{ x: number; y: number }>;
  anchor: { x: number; y: number };
  movedCorners: WorldRect;
  staticCorners: WorldRect | null;
  /** Free cursor-following delta (clamped to world). */
  freeDx: number;
  freeDy: number;
  /** Target commit delta (snapped when snap is active and Alt is not held, clamped to world). */
  dx: number;
  dy: number;
  hasConflict: boolean;
}

interface MarqueeDrag {
  kind: 'marquee';
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  append: boolean;
}

interface PanDrag {
  kind: 'pan';
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
}

type Interaction = PendingSeatPress | SeatDrag | MarqueeDrag | PanDrag;

export interface SeatCanvasInteractionOptions {
  stageRef: RefObject<Konva.Stage | null>;
  selectionBoxRef: RefObject<Konva.Rect | null>;
  boundsBoxRef: RefObject<Konva.Rect | null>;
  marqueeRef: RefObject<Konva.Rect | null>;
  ghostGroupRef?: RefObject<Konva.Group | null>;
  screenGroupRef?: RefObject<Konva.Group | null>;
  dragReadoutRef?: RefObject<Konva.Group | null>;
  snapToGrid: boolean;
  handToolActive: boolean;
}

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
};

/**
 * Pointer interactions of the seat canvas:
 *  - press on a seat selects it immediately; moving 4px+ starts dragging the selection
 *  - drag moves Konva nodes imperatively (no React state per mousemove) and commits once
 *  - marquee starts only on empty canvas
 *  - pan with middle mouse, Space + drag, or the Hand tool
 */
export function useSeatCanvasInteractions({
  stageRef,
  selectionBoxRef,
  boundsBoxRef,
  marqueeRef,
  ghostGroupRef,
  screenGroupRef,
  dragReadoutRef,
  snapToGrid,
  handToolActive,
}: SeatCanvasInteractionOptions) {
  const nodesRef = useRef(new Map<string, Konva.Group>());
  const interactionRef = useRef<Interaction | null>(null);
  const lastSeatClickRef = useRef<{ seatId: string; time: number } | null>(null);
  const spaceDownRef = useRef(false);
  const pointerOverRef = useRef(false);
  const optionsRef = useRef({ snapToGrid, handToolActive });

  const setCursor = useCallback(
    (cursor: string) => {
      const container = stageRef.current?.container();
      if (container) container.style.cursor = cursor;
    },
    [stageRef],
  );

  const isPanMode = useCallback(
    () => spaceDownRef.current || optionsRef.current.handToolActive,
    [],
  );

  useEffect(() => {
    optionsRef.current = { snapToGrid, handToolActive };
    if (!interactionRef.current) {
      setCursor(handToolActive || spaceDownRef.current ? 'grab' : 'default');
    }
  }, [snapToGrid, handToolActive, setCursor]);

  const registerNode = useCallback((id: string, node: Konva.Group | null) => {
    if (node) {
      nodesRef.current.set(id, node);
    } else {
      nodesRef.current.delete(id);
    }
  }, []);

  const clientToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      if (!stage) return null;
      const rect = stage.container().getBoundingClientRect();
      const scale = stage.scaleX() || 1;
      return {
        x: (clientX - rect.left - stage.x()) / scale,
        y: (clientY - rect.top - stage.y()) / scale,
      };
    },
    [stageRef],
  );

  const syncScreenAndBox = useCallback(
    (allCorners: WorldRect | null) => {
      const frame = computeLayoutFrameFromCorners(allCorners);
      boundsBoxRef.current?.setAttrs(frame.box);

      if (screenGroupRef?.current) {
        const body = screenGroupRef.current.findOne<Konva.Line>('.screen-body');
        const highlight = screenGroupRef.current.findOne<Konva.Line>('.screen-highlight');
        const caption = screenGroupRef.current.findOne<Konva.Text>('.screen-caption');
        body?.points(frame.screen.points);
        highlight?.points(frame.screen.highlightPoints);
        caption?.position({ x: frame.screen.centerX - 160, y: frame.screen.captionY });
      }
    },
    [boundsBoxRef, screenGroupRef],
  );

  /** Re-applies selection box, layout box, and screen from the committed store state. */
  const syncOverlaysFromStore = useCallback(() => {
    const { seats, selectedSeatIds } = useSeatEditorStore.getState();
    const all = computeCornerBounds(seats.map((s) => normalizedToWorld(s.x, s.y)));
    const selected = computeCornerBounds(
      seats.filter((s) => selectedSeatIds.has(s.id)).map((s) => normalizedToWorld(s.x, s.y)),
    );

    syncScreenAndBox(all);
    if (selected) {
      selectionBoxRef.current?.setAttrs({
        ...cornerBoundsToBox(selected, SELECTION_THEME.selectionBox.padding),
        visible: true,
      });
    } else {
      selectionBoxRef.current?.visible(false);
    }
    ghostGroupRef?.current?.visible(false);
    stageRef.current?.batchDraw();
  }, [ghostGroupRef, selectionBoxRef, stageRef, syncScreenAndBox]);

  const populateGhostNodes = useCallback(
    (starts: Map<string, { x: number; y: number }>, hasConflict: boolean) => {
      const group = ghostGroupRef?.current;
      if (!group) return;

      group.destroyChildren();
      const theme = hasConflict ? SELECTION_THEME.conflictGhost : SELECTION_THEME.ghost;

      for (const pos of starts.values()) {
        group.add(
          new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: SEAT_METRICS.width,
            height: SEAT_METRICS.height,
            cornerRadius: SEAT_METRICS.cornerRadius,
            fill: theme.fill,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            dash: [...theme.dash],
            listening: false,
          }),
        );
      }
      group.position({ x: 0, y: 0 });
    },
    [ghostGroupRef],
  );

  const updateGhostStyle = useCallback(
    (hasConflict: boolean) => {
      const group = ghostGroupRef?.current;
      if (!group) return;
      const theme = hasConflict ? SELECTION_THEME.conflictGhost : SELECTION_THEME.ghost;
      for (const child of group.getChildren()) {
        if (child instanceof Konva.Rect) {
          child.setAttrs({
            fill: theme.fill,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            dash: [...theme.dash],
          });
        }
      }
    },
    [ghostGroupRef],
  );

  const beginSeatDrag = useCallback(
    (pending: PendingSeatPress): SeatDrag | null => {
      const store = useSeatEditorStore.getState();
      const moveIds = store.selectedSeatIds.has(pending.seatId)
        ? new Set(store.selectedSeatIds)
        : new Set([pending.seatId]);
      if (!store.selectedSeatIds.has(pending.seatId)) {
        store.selectSeat(pending.seatId, false);
      }

      const starts = new Map<string, { x: number; y: number }>();
      const staticPoints: Array<{ x: number; y: number }> = [];
      for (const seat of store.seats) {
        const point = normalizedToWorld(seat.x, seat.y);
        if (moveIds.has(seat.id)) {
          starts.set(seat.id, point);
        } else {
          staticPoints.push(point);
        }
      }

      const anchor = starts.get(pending.seatId);
      const movedCorners = computeCornerBounds(Array.from(starts.values()));
      if (!anchor || !movedCorners) return null;

      populateGhostNodes(starts, false);

      return {
        kind: 'drag',
        seatId: pending.seatId,
        startClientX: pending.startClientX,
        startClientY: pending.startClientY,
        starts,
        staticPoints,
        anchor,
        movedCorners,
        staticCorners: computeCornerBounds(staticPoints),
        freeDx: 0,
        freeDy: 0,
        dx: 0,
        dy: 0,
        hasConflict: false,
      };
    },
    [populateGhostNodes],
  );

  const updateSeatDrag = useCallback(
    (drag: SeatDrag, event: MouseEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const scale = stage.scaleX() || 1;

      const rawDx = (event.clientX - drag.startClientX) / scale;
      const rawDy = (event.clientY - drag.startClientY) / scale;

      const { freeDelta, snappedDelta, shouldSnap } = computeDragDeltas({
        rawDx,
        rawDy,
        anchor: drag.anchor,
        movedCorners: drag.movedCorners,
        snapToGrid: optionsRef.current.snapToGrid,
        altKey: event.altKey,
      });

      drag.freeDx = freeDelta.dx;
      drag.freeDy = freeDelta.dy;
      drag.dx = snappedDelta.dx;
      drag.dy = snappedDelta.dy;

      // Seat nodes follow the cursor freely without snapping
      const targetPositions: Array<{ x: number; y: number }> = [];
      for (const [id, start] of drag.starts) {
        const node = nodesRef.current.get(id);
        if (node) {
          node.position({ x: start.x + drag.freeDx, y: start.y + drag.freeDy });
          node.opacity(0.85);
        }
        targetPositions.push({
          x: start.x + drag.dx,
          y: start.y + drag.dy,
        });
      }

      const prevConflict = drag.hasConflict;
      drag.hasConflict = hasSeatOverlapConflict(targetPositions, drag.staticPoints);
      if (prevConflict !== drag.hasConflict) {
        updateGhostStyle(drag.hasConflict);
      }

      if (ghostGroupRef?.current) {
        ghostGroupRef.current.position({ x: drag.dx, y: drag.dy });
        ghostGroupRef.current.visible(shouldSnap || drag.hasConflict);
      }

      const movedFree: WorldRect = {
        minX: drag.movedCorners.minX + drag.freeDx,
        maxX: drag.movedCorners.maxX + drag.freeDx,
        minY: drag.movedCorners.minY + drag.freeDy,
        maxY: drag.movedCorners.maxY + drag.freeDy,
      };
      const all: WorldRect = drag.staticCorners
        ? {
            minX: Math.min(movedFree.minX, drag.staticCorners.minX),
            maxX: Math.max(movedFree.maxX, drag.staticCorners.maxX),
            minY: Math.min(movedFree.minY, drag.staticCorners.minY),
            maxY: Math.max(movedFree.maxY, drag.staticCorners.maxY),
          }
        : movedFree;

      selectionBoxRef.current?.setAttrs({
        ...cornerBoundsToBox(movedFree, SELECTION_THEME.selectionBox.padding),
        visible: true,
      });
      syncScreenAndBox(all);

      // Live Δx / Δy readout near cursor / selection box
      if (dragReadoutRef?.current) {
        const signX = drag.dx > 0 ? '+' : '';
        const signY = drag.dy > 0 ? '+' : '';
        const store = useSeatEditorStore.getState();
        const seat = store.seats.find((s) => s.id === drag.seatId);
        const seatLabel =
          drag.starts.size > 1
            ? `${drag.starts.size} seats`
            : seat
              ? `${seat.rowLabel}${seat.seatNumber}`
              : 'Seat';
        const textNode = dragReadoutRef.current.findOne<Konva.Text>('Text');
        const rectNode = dragReadoutRef.current.findOne<Konva.Rect>('Rect');
        const conflictSuffix = drag.hasConflict ? ' • Overlap!' : '';
        const labelText = `${seatLabel} • Δx: ${signX}${Math.round(drag.dx)}px  Δy: ${signY}${Math.round(drag.dy)}px${conflictSuffix}`;
        if (textNode) {
          textNode.text(labelText);
          if (rectNode) {
            rectNode.fill(drag.hasConflict ? '#DC2626' : '#0F172A');
            rectNode.width(textNode.width() + 16);
            rectNode.height(textNode.height() + 8);
          }
        }
        dragReadoutRef.current.position({
          x: movedFree.minX,
          y: Math.max(10, movedFree.minY - 26),
        });
        dragReadoutRef.current.visible(true);
      }

      stage.batchDraw();
    },
    [dragReadoutRef, ghostGroupRef, selectionBoxRef, stageRef, syncScreenAndBox, updateGhostStyle],
  );

  const cancelInteraction = useCallback(() => {
    const interaction = interactionRef.current;
    interactionRef.current = null;
    if (!interaction) return;

    if (interaction.kind === 'drag') {
      for (const [id, start] of interaction.starts) {
        const node = nodesRef.current.get(id);
        if (node) {
          node.position({ x: start.x, y: start.y });
          node.opacity(1);
        }
      }
      syncOverlaysFromStore();
    } else if (interaction.kind === 'marquee') {
      marqueeRef.current?.visible(false);
      stageRef.current?.batchDraw();
    } else if (interaction.kind === 'pan') {
      const { pan } = useSeatEditorStore.getState();
      stageRef.current?.position(pan);
      stageRef.current?.batchDraw();
    }
    dragReadoutRef?.current?.visible(false);
    setCursor(isPanMode() ? 'grab' : 'default');
  }, [dragReadoutRef, isPanMode, marqueeRef, setCursor, stageRef, syncOverlaysFromStore]);

  // Window-level listeners so a drag keeps working when the pointer leaves the canvas
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      let interaction = interactionRef.current;
      if (!interaction) return;

      if (interaction.kind === 'pending') {
        const travelled = Math.hypot(
          event.clientX - interaction.startClientX,
          event.clientY - interaction.startClientY,
        );
        if (travelled < DRAG_THRESHOLD_PX) return;

        const drag = beginSeatDrag(interaction);
        if (!drag) {
          interactionRef.current = null;
          return;
        }
        interactionRef.current = drag;
        interaction = drag;
        setCursor('grabbing');
      }

      if (interaction.kind === 'drag') {
        updateSeatDrag(interaction, event);
      } else if (interaction.kind === 'marquee') {
        const world = clientToWorld(event.clientX, event.clientY);
        if (!world) return;
        interaction.currentX = world.x;
        interaction.currentY = world.y;
        marqueeRef.current?.setAttrs({
          x: Math.min(interaction.startX, world.x),
          y: Math.min(interaction.startY, world.y),
          width: Math.abs(world.x - interaction.startX),
          height: Math.abs(world.y - interaction.startY),
          visible: true,
        });
        stageRef.current?.batchDraw();
      } else if (interaction.kind === 'pan') {
        stageRef.current?.position({
          x: interaction.startX + (event.clientX - interaction.startClientX),
          y: interaction.startY + (event.clientY - interaction.startClientY),
        });
        stageRef.current?.batchDraw();
      }
    };

    const onMouseUp = () => {
      const interaction = interactionRef.current;
      interactionRef.current = null;
      if (!interaction) return;

      const store = useSeatEditorStore.getState();

      if (interaction.kind === 'pending') {
        // Plain click on a seat that was part of a multi-selection collapses it to that seat
        if (interaction.collapseOnClick && store.selectedSeatIds.size > 1) {
          store.selectSeat(interaction.seatId, false);
        }
      } else if (interaction.kind === 'drag') {
        dragReadoutRef?.current?.visible(false);
        ghostGroupRef?.current?.visible(false);
        setCursor(isPanMode() ? 'grab' : 'default');

        if (interaction.hasConflict || (interaction.dx === 0 && interaction.dy === 0)) {
          // Cancel move on overlap conflict or zero snapped delta: restore Konva nodes and push no history entry
          for (const [id, start] of interaction.starts) {
            const node = nodesRef.current.get(id);
            if (node) {
              node.position({ x: start.x, y: start.y });
              node.opacity(1);
            }
          }
          syncOverlaysFromStore();
        } else {
          for (const [id, start] of interaction.starts) {
            const node = nodesRef.current.get(id);
            if (node) {
              node.position({ x: start.x + interaction.dx, y: start.y + interaction.dy });
              node.opacity(1);
            }
          }
          const updates = Array.from(interaction.starts, ([id, start]) => {
            const normalized = worldToNormalized(
              start.x + interaction.dx,
              start.y + interaction.dy,
            );
            return { id, x: normalized.x, y: normalized.y };
          });
          // One call = one undo/redo history entry; the dirty flag is derived from the store
          store.batchUpdatePositions(updates);
          syncOverlaysFromStore();
        }
      } else if (interaction.kind === 'marquee') {
        marqueeRef.current?.visible(false);
        stageRef.current?.batchDraw();

        const x1 = Math.min(interaction.startX, interaction.currentX);
        const x2 = Math.max(interaction.startX, interaction.currentX);
        const y1 = Math.min(interaction.startY, interaction.currentY);
        const y2 = Math.max(interaction.startY, interaction.currentY);

        if (x2 - x1 > 3 || y2 - y1 > 3) {
          const enclosed: string[] = [];
          for (const seat of store.seats) {
            const p = normalizedToWorld(seat.x, seat.y);
            if (
              p.x + SEAT_METRICS.width >= x1 &&
              p.x <= x2 &&
              p.y + SEAT_METRICS.height >= y1 &&
              p.y <= y2
            ) {
              enclosed.push(seat.id);
            }
          }
          store.selectMultiple(enclosed, interaction.append);
        } else if (!interaction.append) {
          // Released on empty canvas without dragging: clear selection
          store.clearSelection();
        }
      } else if (interaction.kind === 'pan') {
        const stage = stageRef.current;
        if (stage) store.setPan({ x: stage.x(), y: stage.y() });
        setCursor(isPanMode() ? 'grab' : 'default');
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if (event.code === 'Space') {
        if (pointerOverRef.current) event.preventDefault();
        if (!spaceDownRef.current) {
          spaceDownRef.current = true;
          if (!interactionRef.current) setCursor('grab');
        }
      } else if (event.key === 'Escape' && interactionRef.current) {
        cancelInteraction();
      } else if (event.key === ']' || event.key === '}') {
        event.preventDefault();
        useSeatEditorStore.getState().insertSeatGap(1);
      } else if (event.key === '[' || event.key === '{') {
        event.preventDefault();
        useSeatEditorStore.getState().insertSeatGap(-1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.shiftKey ? 4 : 1;
        useSeatEditorStore.getState().nudgeSelectedGrid(0, -step);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const step = event.shiftKey ? 4 : 1;
        useSeatEditorStore.getState().nudgeSelectedGrid(0, step);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const step = event.shiftKey ? 4 : 1;
        useSeatEditorStore.getState().nudgeSelectedGrid(-step, 0);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const step = event.shiftKey ? 4 : 1;
        useSeatEditorStore.getState().nudgeSelectedGrid(step, 0);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        spaceDownRef.current = false;
        if (!interactionRef.current) setCursor(optionsRef.current.handToolActive ? 'grab' : 'default');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', cancelInteraction);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', cancelInteraction);
    };
  }, [
    beginSeatDrag,
    cancelInteraction,
    clientToWorld,
    dragReadoutRef,
    ghostGroupRef,
    isPanMode,
    marqueeRef,
    setCursor,
    stageRef,
    syncOverlaysFromStore,
    updateSeatDrag,
  ]);

  /**
   * Mouse press on a seat:
   *  - Unselected seats require a double-click (or Shift/Ctrl/Cmd modifier) to become selected.
   *    Single-pressing an unselected seat does not select or drag it (preventing accidental moves).
   *  - Already-selected seats arm a drag immediately on press (moving the selected seat or group).
   */
  const handleSeatMouseDown = useCallback(
    (id: string, e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button !== 0 || isPanMode()) return; // middle mouse / pan mode pan the stage
      e.cancelBubble = true;
      e.evt.preventDefault();

      const now = Date.now();
      const prevClick = lastSeatClickRef.current;
      const isRapidSecondClick =
        prevClick !== null &&
        prevClick.seatId === id &&
        now - prevClick.time <= DOUBLE_CLICK_WINDOW_MS;
      const isDoubleClick = e.evt.detail >= 2 || isRapidSecondClick;
      lastSeatClickRef.current = isDoubleClick ? null : { seatId: id, time: now };

      const store = useSeatEditorStore.getState();
      const modifier = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const wasInSelection = store.selectedSeatIds.has(id);

      if (modifier) {
        store.selectSeat(id, true);
        if (wasInSelection) {
          interactionRef.current = null; // toggled off: nothing to drag
          return;
        }
      } else if (isDoubleClick) {
        // Double-click selects this seat (or isolates it from a multi-selection) for drag-and-drop
        store.selectSeat(id, false);
      } else if (!wasInSelection) {
        // Single press on an unselected seat: do not select or drag
        interactionRef.current = null;
        return;
      }

      interactionRef.current = {
        kind: 'pending',
        seatId: id,
        startClientX: e.evt.clientX,
        startClientY: e.evt.clientY,
        modifier,
        wasInSelection: wasInSelection || isDoubleClick,
        collapseOnClick: false,
      };
    },
    [isPanMode],
  );

  /** Explicit Konva dblclick handler to select a seat for drag-and-drop. */
  const handleSeatDblClick = useCallback(
    (id: string, e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isPanMode()) return;
      e.cancelBubble = true;
      e.evt.preventDefault();

      const modifier = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      useSeatEditorStore.getState().selectSeat(id, modifier);
      lastSeatClickRef.current = null;
    },
    [isPanMode],
  );

  /** Mouse press inside the selection box (gaps, aisles, padding): arms a drag of the whole selection and keeps it. */
  const handleSelectionBoxMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button !== 0 || isPanMode()) return;
      e.cancelBubble = true;
      e.evt.preventDefault();

      const store = useSeatEditorStore.getState();
      const firstSelectedId = store.selectedSeatIds.values().next().value;
      if (!firstSelectedId) return;

      interactionRef.current = {
        kind: 'pending',
        seatId: firstSelectedId,
        startClientX: e.evt.clientX,
        startClientY: e.evt.clientY,
        modifier: false,
        wasInSelection: true,
        collapseOnClick: false,
      };
    },
    [isPanMode],
  );

  /** Mouse press on the stage: pan, or start a marquee when pressing on empty canvas. */
  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;
      const evt = e.evt;

      if (evt.button === 1 || (evt.button === 0 && isPanMode())) {
        evt.preventDefault();
        interactionRef.current = {
          kind: 'pan',
          startClientX: evt.clientX,
          startClientY: evt.clientY,
          startX: stage.x(),
          startY: stage.y(),
        };
        setCursor('grabbing');
        return;
      }

      if (evt.button !== 0) return;
      if (e.target !== stage && e.target.name() !== 'background') return;

      const append = evt.shiftKey || evt.ctrlKey || evt.metaKey;

      const world = clientToWorld(evt.clientX, evt.clientY);
      if (!world) return;
      interactionRef.current = {
        kind: 'marquee',
        startX: world.x,
        startY: world.y,
        currentX: world.x,
        currentY: world.y,
        append,
      };
    },
    [clientToWorld, isPanMode, setCursor, stageRef],
  );

  /** Cursor feedback while idle. */
  const handleStageMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      pointerOverRef.current = true;
      if (interactionRef.current) return;
      if (isPanMode()) {
        setCursor('grab');
        return;
      }
      const seatAncestor = e.target.findAncestor('.seat');
      if (seatAncestor) {
        const seatId = seatAncestor.id();
        const isSelected = useSeatEditorStore.getState().selectedSeatIds.has(seatId);
        setCursor(isSelected ? 'move' : 'pointer');
        return;
      }
      const isDraggableTarget =
        e.target.name() === 'selection-box' || Boolean(e.target.findAncestor('.row-label'));
      setCursor(isDraggableTarget ? 'move' : 'default');
    },
    [isPanMode, setCursor],
  );

  const handleStageMouseLeave = useCallback(() => {
    pointerOverRef.current = false;
  }, []);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();
      if (!stage || !pointer) return;

      const store = useSeatEditorStore.getState();
      const oldScale = store.zoom;
      const scaleBy = 1.08;
      const nextScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const clampedScale = Math.max(ZOOM_LIMITS.min, Math.min(ZOOM_LIMITS.max, nextScale));

      const pointTo = {
        x: (pointer.x - store.pan.x) / oldScale,
        y: (pointer.y - store.pan.y) / oldScale,
      };

      store.setZoom(clampedScale);
      store.setPan({
        x: pointer.x - pointTo.x * clampedScale,
        y: pointer.y - pointTo.y * clampedScale,
      });
    },
    [stageRef],
  );

  /** Mouse press on a row label: selects the whole row and arms a drag of that row. */
  const handleRowLabelMouseDown = useCallback(
    (rowLabel: string, e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button !== 0 || isPanMode()) return;
      e.cancelBubble = true;
      e.evt.preventDefault();

      const store = useSeatEditorStore.getState();
      store.selectRow(rowLabel);

      const rowSeats = store.seats
        .filter((s) => s.rowLabel.trim().toUpperCase() === rowLabel.trim().toUpperCase())
        .sort((a, b) => a.seatNumber - b.seatNumber);

      if (rowSeats.length > 0) {
        interactionRef.current = {
          kind: 'pending',
          seatId: rowSeats[0].id,
          startClientX: e.evt.clientX,
          startClientY: e.evt.clientY,
          modifier: false,
          wasInSelection: true,
          collapseOnClick: false,
        };
      }
    },
    [isPanMode],
  );

  return {
    registerNode,
    handleSeatMouseDown,
    handleSeatDblClick,
    handleSelectionBoxMouseDown,
    handleRowLabelMouseDown,
    handleStageMouseDown,
    handleStageMouseMove,
    handleStageMouseLeave,
    handleWheel,
  };
}

