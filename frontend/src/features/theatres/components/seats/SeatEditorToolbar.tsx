import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Power,
  Save,
  Table as TableIcon,
  Palette,
  Magnet,
  Hand,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/shared/ui';
import { useSeatEditorStore, selectIsDirty } from '../../stores/useSeatEditorStore';
import { SEAT_TYPE_LABELS, type SeatType } from '../../types/seat.types';

export interface SeatEditorToolbarProps {
  viewMode: 'canvas' | 'table';
  onToggleViewMode: (mode: 'canvas' | 'table') => void;
  onSave: () => void;
  isSaving: boolean;
  snapToGrid?: boolean;
  onToggleSnapToGrid?: () => void;
  onRepackRows?: () => void;
  handToolActive?: boolean;
  onToggleHandTool?: () => void;
  onFitView?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const SEAT_TYPES_CONFIG: { type: SeatType; label: string; color: string; bg: string }[] = [
  { type: 'REGULAR', label: SEAT_TYPE_LABELS.REGULAR, color: '#1EA83C', bg: '#F0FDF4' },
  { type: 'PREMIUM', label: SEAT_TYPE_LABELS.PREMIUM, color: '#2563EB', bg: '#EFF6FF' },
  { type: 'RECLINER', label: SEAT_TYPE_LABELS.RECLINER, color: '#D97706', bg: '#FFFBEB' },
  { type: 'SOFA', label: SEAT_TYPE_LABELS.SOFA, color: '#7C3AED', bg: '#FAF5FF' },
  { type: 'WHEELCHAIR', label: SEAT_TYPE_LABELS.WHEELCHAIR, color: '#0D9488', bg: '#F0FDFA' },
];

export const SeatEditorToolbar: React.FC<SeatEditorToolbarProps> = ({
  viewMode,
  onToggleViewMode,
  onSave,
  isSaving,
  snapToGrid = false,
  onToggleSnapToGrid,
  onRepackRows,
  handToolActive = false,
  onToggleHandTool,
  onFitView,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const seats = useSeatEditorStore((s) => s.seats);
  const selectedSeatIds = useSeatEditorStore((s) => s.selectedSeatIds);
  const zoom = useSeatEditorStore((s) => s.zoom);
  const history = useSeatEditorStore((s) => s.history);
  const future = useSeatEditorStore((s) => s.future);

  const selectAll = useSeatEditorStore((s) => s.selectAll);
  const clearSelection = useSeatEditorStore((s) => s.clearSelection);
  const updateSelectedProperties = useSeatEditorStore((s) => s.updateSelectedProperties);
  const nudgeSelectedGrid = useSeatEditorStore((s) => s.nudgeSelectedGrid);
  const insertSeatGap = useSeatEditorStore((s) => s.insertSeatGap);
  const insertRowGap = useSeatEditorStore((s) => s.insertRowGap);
  const rotateSelected = useSeatEditorStore((s) => s.rotateSelected);
  const alignSelected = useSeatEditorStore((s) => s.alignSelected);
  const undo = useSeatEditorStore((s) => s.undo);
  const redo = useSeatEditorStore((s) => s.redo);
  const setZoom = useSeatEditorStore((s) => s.setZoom);
  const setPan = useSeatEditorStore((s) => s.setPan);
  const resetToBaseline = useSeatEditorStore((s) => s.resetToBaseline);

  const isDirty = useSeatEditorStore(selectIsDirty);
  const selectedCount = selectedSeatIds.size;

  const handleResetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-card">
      {/* Top Primary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: View Mode & History */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-surface-muted/50 p-1">
            <button
              type="button"
              onClick={() => onToggleViewMode('canvas')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'canvas'
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Palette size={14} />
              <span>Canvas Visual</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('table')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <TableIcon size={14} />
              <span>Table List</span>
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0}
              className="rounded p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              className="rounded p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <Redo2 size={16} />
            </button>
          </div>

          {/* Zoom Controls (Canvas only) */}
          {viewMode === 'canvas' && (
            <>
              <div className="h-5 w-px bg-border mx-1" />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoom(zoom - 0.15)}
                  className="rounded p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-semibold tabular-nums text-ink px-1 min-w-[44px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom(zoom + 0.15)}
                  className="rounded p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={onFitView ?? handleResetZoomPan}
                  className="rounded p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer transition-colors"
                  title="Fit layout to view"
                  aria-label="Fit layout to view"
                >
                  <Maximize2 size={14} />
                </button>

                <div className="h-5 w-px bg-border mx-1" />

                {/* Hand tool: drag pans the canvas (middle mouse or Space + drag also pan) */}
                {onToggleHandTool && (
                  <button
                    type="button"
                    onClick={onToggleHandTool}
                    aria-pressed={handToolActive}
                    className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      handToolActive
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-border text-ink-muted hover:bg-surface-muted hover:text-ink'
                    }`}
                    title="Hand tool: drag to pan (middle mouse or Space + drag also pan)"
                  >
                    <Hand size={13} />
                    <span>Pan</span>
                  </button>
                )}

                {/* Snap to Grid */}
                {onToggleSnapToGrid && (
                  <button
                    type="button"
                    onClick={onToggleSnapToGrid}
                    className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      snapToGrid
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-border text-ink-muted hover:bg-surface-muted hover:text-ink'
                    }`}
                    title="Snap seats to the seat pitch grid (30px x 28px). Hold Alt while dragging to bypass"
                    aria-pressed={snapToGrid}
                  >
                    <Magnet size={13} />
                    <span>Snap to Grid</span>
                  </button>
                )}

                {/* Re-pack / Format Layout */}
                {onRepackRows && (
                  <button
                    type="button"
                    onClick={onRepackRows}
                    className="flex items-center gap-1 rounded border border-brand-200 bg-brand-50/60 px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100/60 hover:border-brand-300 cursor-pointer transition-colors"
                    title="Format all seats into uniform BookMyShow pitch grid while preserving aisles"
                  >
                    <Sparkles size={13} className="text-brand-600" />
                    <span>Format Layout</span>
                  </button>
                )}

                {/* Fullscreen / Expand Workspace */}
                {onToggleFullscreen && (
                  <button
                    type="button"
                    onClick={onToggleFullscreen}
                    className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      isFullscreen
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-border text-ink-muted hover:bg-surface-muted hover:text-ink'
                    }`}
                    title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Canvas Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Section: Save & Reset Actions */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={resetToBaseline}
              disabled={isSaving}
              className="text-xs font-medium text-ink-muted hover:text-rose-600 transition-colors cursor-pointer px-2"
            >
              Discard Changes
            </button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 min-w-[130px] font-semibold"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : isDirty ? 'Save Layout *' : 'Saved'}</span>
          </Button>
        </div>
      </div>

      {/* Secondary Bar: Selection Controls & Tier Modifiers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/70 text-xs">
        {/* Selection State & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">
              {selectedCount === 1 ? (
                (() => {
                  const singleId = Array.from(selectedSeatIds)[0];
                  const s = seats.find((seat) => seat.id === singleId);
                  if (!s) return <span className="text-brand-600 font-bold">1 Selected</span>;
                  return (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-brand-600 font-bold">Seat {s.rowLabel}{s.seatNumber}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-muted text-ink-muted uppercase border border-border/60">
                        {s.type}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          s.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </span>
                  );
                })()
              ) : selectedCount > 1 ? (
                <span className="text-brand-600 font-bold">{selectedCount} Selected</span>
              ) : (
                <span className="text-ink-muted">{seats.length} Total Seats</span>
              )}
            </span>

            {selectedCount > 0 ? (
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-ink-muted hover:text-ink underline cursor-pointer"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={selectAll}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
              >
                Select All
              </button>
            )}
          </div>

          {/* Contextual Actions when seats are selected */}
          {selectedCount > 0 && (
            <>
              <div className="h-4 w-px bg-border" />

              {/* Set Tier */}
              <div className="flex items-center gap-1.5">
                <span className="text-ink-muted text-[11px]">Set Tier:</span>
                <div className="flex items-center gap-1">
                  {SEAT_TYPES_CONFIG.map(({ type, label, color, bg }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateSelectedProperties({ type })}
                      className="flex items-center gap-1.5 rounded border border-border px-2 py-0.5 text-[11px] font-medium text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-[2px] border-[1.5px] shadow-xs"
                        style={{ borderColor: color, backgroundColor: bg }}
                      />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Toggle Active Status */}
              <button
                type="button"
                onClick={() => {
                  const anyActive = seats.some((s) => selectedSeatIds.has(s.id) && s.isActive);
                  updateSelectedProperties({ isActive: !anyActive });
                }}
                className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-medium text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                title="Toggle Active status of selected seats"
              >
                <Power size={12} className="text-amber-600" />
                <span>Toggle Status</span>
              </button>

              {/* Positioning & Manual Splitting Tools */}
              {viewMode === 'canvas' && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-1">
                    <span className="text-ink-muted text-[11px]">Aisle:</span>
                    <button
                      type="button"
                      onClick={() => insertSeatGap(1)}
                      className="flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-[11px] font-semibold text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                      title="Insert Gap (+1 Seat Pitch, key: ])"
                    >
                      <span>+Gap ( ] )</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSeatGap(-1)}
                      className="flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-[11px] font-semibold text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                      title="Remove Gap (-1 Seat Pitch, key: [)"
                    >
                      <span>-Gap ( [ )</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertRowGap(1)}
                      className="flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-[11px] font-semibold text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                      title="Insert Row Gap (Push rows below down by 1 row pitch)"
                    >
                      <span>+Row Gap</span>
                    </button>
                  </div>

                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-1">
                    <span className="text-ink-muted text-[11px]">Nudge:</span>
                    <button
                      type="button"
                      onClick={() => nudgeSelectedGrid(0, -1)}
                      className="rounded p-1 hover:bg-surface-muted text-ink cursor-pointer"
                      title="Nudge Up (Arrow keys, Shift for 4x)"
                      aria-label="Nudge Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeSelectedGrid(0, 1)}
                      className="rounded p-1 hover:bg-surface-muted text-ink cursor-pointer"
                      title="Nudge Down (Arrow keys, Shift for 4x)"
                      aria-label="Nudge Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeSelectedGrid(-1, 0)}
                      className="rounded p-1 hover:bg-surface-muted text-ink cursor-pointer"
                      title="Nudge Left (Arrow keys, Shift for 4x)"
                      aria-label="Nudge Left"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeSelectedGrid(1, 0)}
                      className="rounded p-1 hover:bg-surface-muted text-ink cursor-pointer"
                      title="Nudge Right (Arrow keys, Shift for 4x)"
                      aria-label="Nudge Right"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => rotateSelected(45)}
                      className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-medium text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                      title="Rotate +45°"
                    >
                      <RotateCw size={12} />
                      <span>45°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alignSelected('horizontal')}
                      className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-medium text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                      title="Align Selected into Row"
                    >
                      <AlignHorizontalDistributeCenter size={12} />
                      <span>Align Row</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alignSelected('vertical')}
                      className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-medium text-ink hover:bg-surface-muted cursor-pointer transition-colors"
                      title="Align Selected into Column"
                    >
                      <AlignVerticalDistributeCenter size={12} />
                      <span>Align Col</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-ink-muted">
          {SEAT_TYPES_CONFIG.map(({ type, label, color, bg }) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-[2px] border-[1.5px] shadow-xs"
                style={{ borderColor: color, backgroundColor: bg }}
              />
              <span>{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[2px] border border-dashed border-slate-300 bg-slate-100" />
            <span>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
};
