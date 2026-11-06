import React from 'react';
import type { PreviewLayoutData } from '../../utils/sectionLayoutGenerator';
import { SEAT_TYPE_LABELS, type SeatType } from '../../types/seat.types';

export interface SeatLayoutPreviewProps {
  previewData: PreviewLayoutData;
  screenName?: string;
  hasHorizontalAisles?: boolean;
}

const TIER_COLORS: Record<SeatType, { border: string; text: string; bg: string }> = {
  REGULAR: { border: '#1EA83C', text: '#1EA83C', bg: '#FFFFFF' },
  PREMIUM: { border: '#2563EB', text: '#2563EB', bg: '#FFFFFF' },
  RECLINER: { border: '#D97706', text: '#D97706', bg: '#FFFFFF' },
  SOFA: { border: '#7C3AED', text: '#7C3AED', bg: '#FFFFFF' },
  WHEELCHAIR: { border: '#0D9488', text: '#0D9488', bg: '#FFFFFF' },
};

export const SeatLayoutPreview: React.FC<SeatLayoutPreviewProps> = ({
  previewData,
  screenName,
}) => {
  const { seats, totalSeats, sections } = previewData;

  // Group seats by row using their exact pixelX / pixelY coordinates (30x28 pitch)
  const rowsMap = new Map<string, typeof seats>();
  for (const seat of seats) {
    const list = rowsMap.get(seat.rowLabel) || [];
    list.push(seat);
    rowsMap.set(seat.rowLabel, list);
  }

  const rowsList = Array.from(rowsMap.entries()).map(([label, rowSeats]) => {
    const avgY = rowSeats.reduce((acc, s) => acc + s.pixelY, 0) / rowSeats.length;
    const type = rowSeats[0]?.type || 'REGULAR';
    return { label, rowSeats, avgY, type };
  });
  rowsList.sort((a, b) => a.avgY - b.avgY);

  if (seats.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/30 p-6 text-center">
        <p className="text-sm font-medium text-ink-muted">No seats configured yet.</p>
        <p className="mt-1 text-xs text-ink-muted/80">
          Add rows and sections in the configuration table to see a real-time layout preview.
        </p>
      </div>
    );
  }

  // Exact seat geometry matching SeatCanvas (28x24 seat box, 30x28 pitch)
  const SEAT_BOX_W = 28;
  const SEAT_BOX_H = 24;
  const LAYOUT_PAD = 24;
  const MARGIN_LEFT = 76;
  const MARGIN_RIGHT = 76;
  const MARGIN_TOP = 64;
  const MARGIN_BOTTOM = 96;

  const maxPixelX = Math.max(...seats.map((s) => s.pixelX), 0);
  const maxPixelY = Math.max(...seats.map((s) => s.pixelY), 0);
  const contentWidth = maxPixelX + SEAT_BOX_W;
  const contentHeight = maxPixelY + SEAT_BOX_H;

  const VIEW_WIDTH = Math.max(520, contentWidth + MARGIN_LEFT + MARGIN_RIGHT);
  const VIEW_HEIGHT = Math.max(300, contentHeight + MARGIN_TOP + MARGIN_BOTTOM);

  const originX = (VIEW_WIDTH - contentWidth) / 2;
  const originY = MARGIN_TOP;

  const layoutBox = {
    x: originX - LAYOUT_PAD,
    y: originY - LAYOUT_PAD,
    width: contentWidth + LAYOUT_PAD * 2,
    height: contentHeight + LAYOUT_PAD * 2,
  };

  // Detect cross-aisles (> 1.35x normal row pitch)
  const crossAisleYs: { key: string; y: number }[] = [];
  for (let i = 0; i < rowsList.length - 1; i++) {
    const gap = rowsList[i + 1].avgY - rowsList[i].avgY;
    if (gap > 28 * 1.35) {
      crossAisleYs.push({
        key: `${rowsList[i].label}-${rowsList[i + 1].label}`,
        y: originY + (rowsList[i].avgY + rowsList[i + 1].avgY) / 2,
      });
    }
  }

  // Group consecutive rows of same tier for tier headers
  const tierBlocks: { type: SeatType; topY: number; bottomY: number }[] = [];
  for (const r of rowsList) {
    const rowTop = originY + r.avgY;
    const rowBottom = rowTop + SEAT_BOX_H;
    const last = tierBlocks[tierBlocks.length - 1];
    if (last && last.type === r.type) {
      last.bottomY = Math.max(last.bottomY, rowBottom);
    } else {
      tierBlocks.push({ type: r.type, topY: rowTop, bottomY: rowBottom });
    }
  }

  const screenTop = originY + contentHeight + 24;
  const screenCenterX = originX + contentWidth / 2;
  const screenTopWidth = Math.max(contentWidth * 0.55, 340);
  const screenBottomWidth = screenTopWidth * 0.88;
  const screenHeight = 16;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-white shadow-card overflow-hidden">
      {/* Preview Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface-muted/40 px-5 py-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
            Live Auditorium Blueprint Preview
          </h4>
          {screenName && (
            <span className="text-xs text-ink-muted">({screenName})</span>
          )}
        </div>

        {/* Section summaries */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {sections.map((sec) => (
            <div key={sec.id} className="flex items-center gap-1.5 text-ink-muted">
              <span className="font-semibold text-ink">{sec.name}:</span>
              <span className="font-medium text-brand-600">{sec.totalSeats} seats</span>
            </div>
          ))}
          <div className="h-3 w-px bg-border" />
          <div className="font-bold text-ink">
            Total: <span className="text-brand-600">{totalSeats}</span>
          </div>
        </div>
      </div>

      {/* SVG Preview Stage */}
      <div className="overflow-x-auto p-4 sm:p-6 bg-white flex justify-center">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full max-w-5xl h-auto select-none"
          style={{ minWidth: '520px', maxHeight: '620px' }}
        >
          {/* Outer Layout Bounding Box (matches SeatCanvas boundsBox) */}
          <rect
            x={layoutBox.x}
            y={layoutBox.y}
            width={layoutBox.width}
            height={layoutBox.height}
            fill="#F8FAFC"
            fillOpacity={0.25}
            stroke="#CBD5E1"
            strokeWidth="1.2"
            strokeDasharray="5 5"
            rx="8"
          />

          {/* Section Column Header Guides */}
          {sections.length > 1 &&
            sections.map((sec, i) => {
              const secSeats = seats.filter((s) => s.sectionId === sec.id);
              if (secSeats.length === 0) return null;

              const minX = Math.min(...secSeats.map((s) => s.pixelX));
              const maxX = Math.max(...secSeats.map((s) => s.pixelX));

              const leftPx = originX + minX;
              const rightPx = originX + maxX + SEAT_BOX_W;
              const centerPx = (leftPx + rightPx) / 2;

              return (
                <g key={sec.id}>
                  <text
                    x={centerPx}
                    y={layoutBox.y - 8}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#64748B"
                    letterSpacing="0.06em"
                  >
                    {sec.name.toUpperCase()} ({sec.totalSeats})
                  </text>
                  <rect
                    x={leftPx - 5}
                    y={originY - 5}
                    width={rightPx - leftPx + 10}
                    height={contentHeight + 10}
                    fill={i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                    rx="6"
                    opacity={0.55}
                  />
                </g>
              );
            })}

          {/* Tier Block Headers / Dividers */}
          {tierBlocks.map((tier, idx) => {
            const prev = idx > 0 ? tierBlocks[idx - 1] : null;
            const hasGap = !prev || tier.topY - prev.bottomY >= 20;
            const headerY = idx === 0 ? tier.topY - 18 : (prev!.bottomY + tier.topY) / 2 - 7;

            if (hasGap) {
              return (
                <g key={`tier-${tier.type}-${tier.topY}`}>
                  <rect
                    x={layoutBox.x}
                    y={headerY - 2}
                    width="90"
                    height="15"
                    rx="3"
                    fill="#F8FAFC"
                  />
                  <text
                    x={layoutBox.x + 4}
                    y={headerY + 9}
                    fontSize="10"
                    fontWeight="700"
                    fill="#64748B"
                    letterSpacing="0.08em"
                  >
                    {tier.type}
                  </text>
                  <line
                    x1={layoutBox.x + 94}
                    y1={headerY + 5}
                    x2={layoutBox.x + layoutBox.width}
                    y2={headerY + 5}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                </g>
              );
            }

            const dividerY = (prev!.bottomY + tier.topY) / 2;
            return (
              <line
                key={`tier-div-${tier.type}-${tier.topY}`}
                x1={originX}
                y1={dividerY}
                x2={originX + contentWidth}
                y2={dividerY}
                stroke="#CBD5E1"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Row Labels on Left and Right */}
          {rowsList.map(({ label, avgY }) => {
            const pillY = originY + avgY + (SEAT_BOX_H - 22) / 2;
            const leftPillX = originX - 34;
            const rightPillX = originX + contentWidth + 8;

            return (
              <g key={`row-label-${label}`}>
                {/* Left Row Pill */}
                <rect
                  x={leftPillX}
                  y={pillY}
                  width="26"
                  height="22"
                  rx="4"
                  fill="#F1F5F9"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={leftPillX + 13}
                  y={pillY + 14.5}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="bold"
                  fill="#475569"
                >
                  {label}
                </text>

                {/* Right Row Pill */}
                <rect
                  x={rightPillX}
                  y={pillY}
                  width="26"
                  height="22"
                  rx="4"
                  fill="#F1F5F9"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={rightPillX + 13}
                  y={pillY + 14.5}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="bold"
                  fill="#475569"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Cross-Aisle "-" Markers */}
          {crossAisleYs.map((aisle) => (
            <g key={`aisle-${aisle.key}`}>
              <text
                x={originX - 21}
                y={aisle.y + SEAT_BOX_H / 2 + 4}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#94A3B8"
              >
                -
              </text>
              <text
                x={originX + contentWidth + 21}
                y={aisle.y + SEAT_BOX_H / 2 + 4}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#94A3B8"
              >
                -
              </text>
            </g>
          ))}

          {/* Seats Rendering at Exact 30x28 Pitch */}
          {seats.map((seat) => {
            const xPx = originX + seat.pixelX;
            const yPx = originY + seat.pixelY;
            const colors = TIER_COLORS[seat.type] || TIER_COLORS.REGULAR;
            const displayNumber =
              seat.seatNumber < 10 ? `0${seat.seatNumber}` : `${seat.seatNumber}`;

            return (
              <g key={`${seat.rowLabel}-${seat.seatNumber}`}>
                <rect
                  x={xPx}
                  y={yPx}
                  width={SEAT_BOX_W}
                  height={SEAT_BOX_H}
                  rx="4"
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth="1.4"
                />
                <text
                  x={xPx + SEAT_BOX_W / 2}
                  y={yPx + 15.5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={colors.text}
                >
                  {displayNumber}
                </text>
              </g>
            );
          })}

          {/* Screen Display at Bottom (Matching SeatCanvas trapezoid) */}
          <g>
            <polygon
              points={[
                `${screenCenterX - screenTopWidth / 2},${screenTop}`,
                `${screenCenterX + screenTopWidth / 2},${screenTop}`,
                `${screenCenterX + screenBottomWidth / 2},${screenTop + screenHeight}`,
                `${screenCenterX - screenBottomWidth / 2},${screenTop + screenHeight}`,
              ].join(' ')}
              fill="#E0F2FE"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line
              x1={screenCenterX - screenTopWidth / 2 + 16}
              y1={screenTop + 3}
              x2={screenCenterX + screenTopWidth / 2 - 16}
              y2={screenTop + 3}
              stroke="#BAE6FD"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <text
              x={screenCenterX}
              y={screenTop + screenHeight + 18}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill="#94A3B8"
            >
              All eyes this way please
            </text>
          </g>
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between border-t border-border bg-surface-muted/30 px-5 py-2.5 text-xs text-ink-muted">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-ink">Seat Tiers:</span>
          {(['REGULAR', 'PREMIUM', 'RECLINER', 'SOFA', 'WHEELCHAIR'] as SeatType[]).map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm border"
                style={{
                  backgroundColor: TIER_COLORS[type].bg,
                  borderColor: TIER_COLORS[type].border,
                }}
              />
              <span>{SEAT_TYPE_LABELS[type]}</span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-ink-muted">
          Vertical and horizontal gaps represent real auditorium walking aisles.
        </div>
      </div>
    </div>
  );
};

