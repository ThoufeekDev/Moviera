import React, { useEffect, useMemo, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva';
import type Konva from 'konva';
import { SeatShape } from './SeatShape';
import {
  computeContentRect,
  computeCornerBounds,
  computeFitView,
  computeLayoutFrame,
  cornerBoundsToBox,
  normalizedToWorld,
} from '../../utils/seatCoordinates';
import { computeLayoutMetadata } from '../../utils/sectionLayoutGenerator';
import { SEAT_METRICS, WORLD_HEIGHT, WORLD_WIDTH } from '../../utils/seatMetrics';
import { SELECTION_THEME } from '../../utils/seatTheme';
import { useSeatEditorStore } from '../../stores/useSeatEditorStore';
import { useSeatCanvasInteractions } from '../../hooks/useSeatCanvasInteractions';

export interface SeatCanvasProps {
  containerWidth: number;
  containerHeight: number;
  /** Snap seats to the seat pitch grid while dragging (hold Alt to bypass temporarily). */
  snapToGrid?: boolean;
  /** Explicit Hand tool: dragging pans the stage instead of selecting. */
  handToolActive?: boolean;
}

export const SeatCanvas: React.FC<SeatCanvasProps> = ({
  containerWidth,
  containerHeight,
  snapToGrid = true,
  handToolActive = false,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const selectionBoxRef = useRef<Konva.Rect>(null);
  const boundsBoxRef = useRef<Konva.Rect>(null);
  const marqueeRef = useRef<Konva.Rect>(null);
  const ghostGroupRef = useRef<Konva.Group>(null);
  const screenGroupRef = useRef<Konva.Group>(null);
  const dragReadoutRef = useRef<Konva.Group>(null);
  const fittedForScreenRef = useRef<string | null>(null);

  const screenId = useSeatEditorStore((s) => s.screenId);
  const seats = useSeatEditorStore((s) => s.seats);
  const selectedSeatIds = useSeatEditorStore((s) => s.selectedSeatIds);
  const zoom = useSeatEditorStore((s) => s.zoom);
  const pan = useSeatEditorStore((s) => s.pan);
  const setZoom = useSeatEditorStore((s) => s.setZoom);
  const setPan = useSeatEditorStore((s) => s.setPan);

  const {
    registerNode,
    handleSeatMouseDown,
    handleSelectionBoxMouseDown,
    handleRowLabelMouseDown,
    handleStageMouseDown,
    handleStageMouseMove,
    handleStageMouseLeave,
    handleWheel,
  } = useSeatCanvasInteractions({
    stageRef,
    selectionBoxRef,
    boundsBoxRef,
    marqueeRef,
    ghostGroupRef,
    screenGroupRef,
    dragReadoutRef,
    snapToGrid,
    handToolActive,
  });

  // World positions come from the fixed normalized <-> world mapping (see seatMetrics.ts)
  const seatPositions = useMemo(
    () => seats.map((seat) => ({ seat, pos: normalizedToWorld(seat.x, seat.y) })),
    [seats],
  );

  // Row grouping, tier blocks and cross-aisles (grouped strictly by rowLabel)
  const layoutMeta = useMemo(() => computeLayoutMetadata(seats), [seats]);

  // Vertical section column guides when rows have multiple sections separated by walking aisles
  const sectionColumns = useMemo(() => {
    const maxSecCount = Math.max(0, ...layoutMeta.rows.map((r) => r.sections?.length ?? 0));
    if (maxSecCount <= 1) return [];

    const matchingRows = layoutMeta.rows.filter((r) => (r.sections?.length ?? 0) === maxSecCount);
    const cols: { left: number; right: number; count: number }[] = [];

    for (let i = 0; i < maxSecCount; i++) {
      let minX = Infinity;
      let maxX = -Infinity;
      let count = 0;
      for (const r of matchingRows) {
        const secSeats = r.sections?.[i] ?? [];
        for (const s of secSeats) {
          const wx = s.x * WORLD_WIDTH;
          if (wx < minX) minX = wx;
          if (wx + SEAT_METRICS.width > maxX) maxX = wx + SEAT_METRICS.width;
          count++;
        }
      }
      if (minX < Infinity && maxX > -Infinity) {
        cols.push({ left: minX, right: maxX, count });
      }
    }
    return cols;
  }, [layoutMeta]);

  // Fit-to-view on initial load for a screen (or when seat count changes after setup generation)
  useEffect(() => {
    if (!screenId || seatPositions.length === 0) return;
    const fitKey = `${screenId}:${seatPositions.length}`;
    if (fittedForScreenRef.current === fitKey) return;
    fittedForScreenRef.current = fitKey;

    const rect = computeContentRect(seatPositions.map((p) => p.pos));
    if (!rect) return;
    const fit = computeFitView(rect, containerWidth, containerHeight);
    setZoom(fit.zoom);
    setPan(fit.pan);
  }, [screenId, seatPositions, containerWidth, containerHeight, setZoom, setPan]);

  // Unified layout frame (seatBounds, layout box with per-side padding & min size, and screen geometry)
  const layoutFrame = useMemo(
    () => computeLayoutFrame(seatPositions.map((p) => p.pos)),
    [seatPositions],
  );
  const { seatBounds, box: layoutBox, screen } = layoutFrame;

  // Active selection box (neutral, 6px padding). Interactive and updated live while dragging.
  const selectionBox = useMemo(() => {
    const corners = computeCornerBounds(
      seatPositions.filter((p) => selectedSeatIds.has(p.seat.id)).map((p) => p.pos),
    );
    return corners ? cornerBoundsToBox(corners, SELECTION_THEME.selectionBox.padding) : null;
  }, [seatPositions, selectedSeatIds]);

  const rowPillX = seatBounds.minX - 34;
  const rightRowPillX = seatBounds.maxX + 8;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-white rounded-xl border border-border shadow-xs">
      <Stage
        ref={stageRef}
        width={containerWidth}
        height={containerHeight}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
      >
        {/* Layer 1: background, tier headers, layout box, row labels, screen */}
        <Layer>
          <Rect
            name="background"
            x={0}
            y={0}
            width={WORLD_WIDTH}
            height={WORLD_HEIGHT}
            fill="#FFFFFF"
          />

          {layoutMeta.tierBlocks.map((tier, idx) => {
            const prevTier = idx > 0 ? layoutMeta.tierBlocks[idx - 1] : null;
            const hasGap = !prevTier || tier.topY - prevTier.bottomY >= 20;
            const headerY =
              idx === 0
                ? tier.topY - 18
                : (prevTier!.bottomY + tier.topY) / 2 - 8;

            if (hasGap) {
              return (
                <Group key={`tier-${tier.displayName}-${tier.topY}`} listening={false}>
                  <Rect
                    x={seatBounds.minX}
                    y={headerY - 2}
                    width={110}
                    height={16}
                    fill="#F8FAFC"
                    cornerRadius={3}
                  />
                  <Text
                    x={seatBounds.minX + 4}
                    y={headerY}
                    text={tier.priceLabel ? `${tier.priceLabel} ${tier.displayName}` : tier.displayName}
                    fontSize={10.5}
                    fontStyle="bold"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#64748B"
                    letterSpacing={1.2}
                  />
                  <Line
                    points={[seatBounds.minX + 115, headerY + 6, seatBounds.maxX, headerY + 6]}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                </Group>
              );
            }

            const dividerY = (prevTier!.bottomY + tier.topY) / 2;
            return (
              <Line
                key={`tier-div-${tier.displayName}-${tier.topY}`}
                points={[seatBounds.minX, dividerY, seatBounds.maxX, dividerY]}
                stroke="#CBD5E1"
                strokeWidth={1}
                dash={[3, 3]}
                listening={false}
              />
            );
          })}

          <Rect
            ref={boundsBoxRef}
            id="bounds-box"
            x={layoutBox.x}
            y={layoutBox.y}
            width={layoutBox.width}
            height={layoutBox.height}
            stroke="#CBD5E1"
            strokeWidth={1.2}
            dash={[5, 5]}
            cornerRadius={8}
            fill="#F8FAFC"
            fillOpacity={0.25}
            listening={false}
          />

          {sectionColumns.map((col, idx) => (
            <Rect
              key={`sec-col-${idx}-${col.left}`}
              x={col.left - 5}
              y={seatBounds.minY - 5}
              width={col.right - col.left + 10}
              height={seatBounds.height + 10}
              fill={idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
              stroke="#E2E8F0"
              strokeWidth={0.8}
              dash={[4, 4]}
              cornerRadius={6}
              opacity={0.55}
              listening={false}
            />
          ))}

          {layoutMeta.rows.map((row) => {
            const pillY = row.avgY + (SEAT_METRICS.height - 22) / 2;
            return (
              <Group key={`row-group-${row.rowLabel}`}>
                {/* Left Row Pill */}
                <Group
                  id={`row-label-${row.rowLabel}-left`}
                  name="row-label"
                  x={rowPillX}
                  y={pillY}
                  onMouseDown={(e) => handleRowLabelMouseDown(row.rowLabel, e)}
                >
                  <Rect width={26} height={22} cornerRadius={4} fill="#F1F5F9" stroke="#E2E8F0" strokeWidth={1} />
                  <Text
                    text={row.rowLabel}
                    width={26}
                    height={22}
                    align="center"
                    verticalAlign="middle"
                    fontSize={10.5}
                    fontStyle="bold"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#475569"
                    listening={false}
                  />
                </Group>

                {/* Right Row Pill */}
                <Group
                  name="row-label"
                  x={rightRowPillX}
                  y={pillY}
                  onMouseDown={(e) => handleRowLabelMouseDown(row.rowLabel, e)}
                >
                  <Rect width={26} height={22} cornerRadius={4} fill="#F1F5F9" stroke="#E2E8F0" strokeWidth={1} />
                  <Text
                    text={row.rowLabel}
                    width={26}
                    height={22}
                    align="center"
                    verticalAlign="middle"
                    fontSize={10.5}
                    fontStyle="bold"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#475569"
                    listening={false}
                  />
                </Group>

                {/* Warning if seat x-order differs from numbering order */}
                {row.hasOrderMismatch && (
                  <Group x={rowPillX - 195} y={pillY + 2} listening={false}>
                    <Rect width={186} height={18} cornerRadius={3} fill="#FEF2F2" stroke="#FCA5A5" strokeWidth={1} />
                    <Text
                      text="⚠ seat order differs from numbering"
                      x={6}
                      y={4}
                      fontSize={8.5}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fill="#DC2626"
                      fontStyle="bold"
                    />
                  </Group>
                )}
              </Group>
            );
          })}

          {/* "-" marker only where a real cross-aisle gap exists between two rows */}
          {layoutMeta.crossAisles.map((aisle) => (
            <Group key={`cross-aisle-${aisle.afterRowLabel}`} listening={false}>
              <Text
                x={rowPillX}
                y={aisle.y + SEAT_METRICS.height / 2 - 7}
                width={26}
                text="-"
                align="center"
                fontSize={14}
                fontStyle="bold"
                fill="#94A3B8"
              />
              <Text
                x={rightRowPillX}
                y={aisle.y + SEAT_METRICS.height / 2 - 7}
                width={26}
                text="-"
                align="center"
                fontSize={14}
                fontStyle="bold"
                fill="#94A3B8"
              />
            </Group>
          ))}

          <Group ref={screenGroupRef} listening={false}>
            <Line
              name="screen-body"
              points={screen.points}
              closed={true}
              fill="#E0F2FE"
              stroke="#38BDF8"
              strokeWidth={1.5}
              lineJoin="round"
            />
            <Line
              name="screen-highlight"
              points={screen.highlightPoints}
              stroke="#BAE6FD"
              strokeWidth={1.2}
              lineCap="round"
            />
            <Text
              name="screen-caption"
              x={screen.centerX - 160}
              y={screen.captionY}
              width={320}
              text="All eyes this way please"
              align="center"
              fontSize={10.5}
              fontStyle="bold"
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#94A3B8"
            />
          </Group>
        </Layer>

        {/* Layer 2: interactive selection box (below seats), snap/conflict ghost, seats, marquee */}
        <Layer>
          <Rect
            ref={selectionBoxRef}
            name="selection-box"
            visible={selectionBox !== null}
            x={selectionBox?.x ?? 0}
            y={selectionBox?.y ?? 0}
            width={selectionBox?.width ?? 0}
            height={selectionBox?.height ?? 0}
            fill={SELECTION_THEME.selectionBox.fill}
            stroke={SELECTION_THEME.selectionBox.stroke}
            strokeWidth={SELECTION_THEME.selectionBox.strokeWidth}
            dash={[...SELECTION_THEME.selectionBox.dash]}
            cornerRadius={6}
            listening={true}
            onMouseDown={handleSelectionBoxMouseDown}
          />

          <Group ref={ghostGroupRef} visible={false} listening={false} />

          {seatPositions.map(({ seat, pos }) => (
            <SeatShape
              key={seat.id}
              seat={seat}
              x={pos.x}
              y={pos.y}
              isSelected={selectedSeatIds.has(seat.id)}
              onSeatMouseDown={handleSeatMouseDown}
              registerNode={registerNode}
            />
          ))}

          <Rect
            ref={marqueeRef}
            visible={false}
            fill={SELECTION_THEME.marquee.fill}
            stroke={SELECTION_THEME.marquee.stroke}
            strokeWidth={SELECTION_THEME.marquee.strokeWidth}
            dash={[...SELECTION_THEME.marquee.dash]}
            listening={false}
          />

          {/* Live Δx / Δy Drag Readout */}
          <Group ref={dragReadoutRef} visible={false} listening={false}>
            <Rect
              cornerRadius={4}
              fill="#0F172A"
              opacity={0.88}
              shadowColor="#000000"
              shadowBlur={6}
              shadowOpacity={0.2}
              shadowOffset={{ x: 0, y: 2 }}
            />
            <Text
              x={8}
              y={5}
              fill="#FFFFFF"
              fontSize={10.5}
              fontStyle="bold"
              fontFamily="system-ui, -apple-system, sans-serif"
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

