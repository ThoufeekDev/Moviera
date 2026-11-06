import React, { useCallback, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import type { Seat } from '../../types/seat.types';
import { SEAT_METRICS } from '../../utils/seatMetrics';
import { SEAT_THEME, TIER_COLORS, withAlpha } from '../../utils/seatTheme';

export interface SeatShapeProps {
  seat: Seat;
  x: number;
  y: number;
  isSelected: boolean;
  /** Mouse press on the seat (arms drag if seat is selected or double-clicked). */
  onSeatMouseDown: (id: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
  /** Double-click on the seat to select it for drag-and-drop. */
  onSeatDblClick?: (id: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
  /** Lets the canvas move this node imperatively while dragging (no React state per mousemove). */
  registerNode: (id: string, node: Konva.Group | null) => void;
}

export const SeatShape: React.FC<SeatShapeProps> = React.memo(
  ({ seat, x, y, isSelected, onSeatMouseDown, onSeatDblClick, registerNode }) => {
    const [isHovered, setIsHovered] = useState(false);

    const tierColor = (TIER_COLORS[seat.type] ?? TIER_COLORS.REGULAR).color;
    const isInactive = !seat.isActive;

    const setNode = useCallback(
      (node: Konva.Group | null) => registerNode(seat.id, node),
      [registerNode, seat.id],
    );

    let fill: string = SEAT_THEME.available.fill;
    let stroke = tierColor;
    let strokeWidth: number = SEAT_THEME.available.strokeWidth;
    let textColor = tierColor;
    let fontStyle = 'normal';

    if (isInactive) {
      fill = SEAT_THEME.inactive.fill;
      stroke = isSelected ? SEAT_THEME.inactive.selectedStroke : SEAT_THEME.inactive.stroke;
      strokeWidth = isSelected ? SEAT_THEME.selected.strokeWidth : SEAT_THEME.available.strokeWidth;
      textColor = SEAT_THEME.inactive.text;
      fontStyle = isSelected ? 'bold' : 'normal';
    } else if (isSelected) {
      fill = withAlpha(tierColor, SEAT_THEME.selected.fillAlpha);
      strokeWidth = SEAT_THEME.selected.strokeWidth;
      fontStyle = 'bold';
    } else if (isHovered) {
      fill = withAlpha(tierColor, SEAT_THEME.hoverFillAlpha);
    }

    const displayNumber =
      seat.seatNumber < 10 ? `0${seat.seatNumber}` : `${seat.seatNumber}`;

    return (
      <Group
        ref={setNode}
        id={seat.id}
        name="seat"
        x={x}
        y={y}
        onMouseDown={(e) => onSeatMouseDown(seat.id, e)}
        onDblClick={(e) => onSeatDblClick?.(seat.id, e)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Rect
          width={SEAT_METRICS.width}
          height={SEAT_METRICS.height}
          cornerRadius={SEAT_METRICS.cornerRadius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          shadowColor={isSelected && !isInactive ? tierColor : undefined}
          shadowBlur={isSelected && !isInactive ? SEAT_THEME.selected.glowBlur : 0}
          shadowOpacity={isSelected && !isInactive ? SEAT_THEME.selected.glowOpacity : 0}
        />

        <Text
          text={displayNumber}
          width={SEAT_METRICS.width}
          height={SEAT_METRICS.height}
          align="center"
          verticalAlign="middle"
          fontSize={10}
          fontStyle={fontStyle}
          fontFamily="system-ui, -apple-system, sans-serif"
          fill={textColor}
          listening={false}
        />
      </Group>
    );
  },
);

SeatShape.displayName = 'SeatShape';
