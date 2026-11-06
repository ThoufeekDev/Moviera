import React, { useState, useMemo } from 'react';
import { useSeatEditorStore } from '../../stores/useSeatEditorStore';
import { SEAT_TYPES, SEAT_TYPE_LABELS, type SeatType } from '../../types/seat.types';

const SEAT_TYPE_OPTIONS: { value: SeatType; label: string }[] = SEAT_TYPES.map((type) => ({
  value: type,
  label: SEAT_TYPE_LABELS[type],
}));

export const SeatTableView: React.FC = () => {
  const seats = useSeatEditorStore((s) => s.seats);
  const selectedSeatIds = useSeatEditorStore((s) => s.selectedSeatIds);
  const selectSeat = useSeatEditorStore((s) => s.selectSeat);
  const selectAll = useSeatEditorStore((s) => s.selectAll);
  const clearSelection = useSeatEditorStore((s) => s.clearSelection);
  const updateSelectedProperties = useSeatEditorStore((s) => s.updateSelectedProperties);

  const [filterRow, setFilterRow] = useState<string>('ALL');
  const [filterTier, setFilterTier] = useState<string>('ALL');

  // Unique rows for filtering
  const distinctRows = useMemo(
    () => Array.from(new Set(seats.map((s) => s.rowLabel))).sort(),
    [seats],
  );

  // Filtered seats
  const filteredSeats = useMemo(() => {
    return seats
      .filter((s) => (filterRow === 'ALL' ? true : s.rowLabel === filterRow))
      .filter((s) => (filterTier === 'ALL' ? true : s.type === filterTier))
      .sort((a, b) => {
        if (a.rowLabel !== b.rowLabel) return a.rowLabel.localeCompare(b.rowLabel);
        return a.seatNumber - b.seatNumber;
      });
  }, [seats, filterRow, filterTier]);

  const allFilteredSelected =
    filteredSeats.length > 0 && filteredSeats.every((s) => selectedSeatIds.has(s.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-6 shadow-card">
      {/* Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
            Filter Row:
            <select
              value={filterRow}
              onChange={(e) => setFilterRow(e.target.value)}
              className="rounded border border-border bg-surface px-2 py-1 text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-brand-600"
            >
              <option value="ALL">All Rows</option>
              {distinctRows.map((r) => (
                <option key={r} value={r}>
                  Row {r}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
            Filter Tier:
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="rounded border border-border bg-surface px-2 py-1 text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-brand-600"
            >
              <option value="ALL">All Tiers</option>
              {SEAT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <span className="text-xs text-ink-muted">
          Showing {filteredSeats.length} of {seats.length} seats
        </span>
      </div>

      {/* Accessible Table */}
      <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="sticky top-0 bg-surface border-b border-border text-ink-muted z-10 shadow-xs">
            <tr>
              <th className="py-2.5 px-3 w-10">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-border accent-brand-600 focus:ring-brand-600 cursor-pointer"
                  aria-label="Select all displayed seats"
                />
              </th>
              <th className="py-2.5 px-3 font-semibold">Seat Label</th>
              <th className="py-2.5 px-3 font-semibold">Row</th>
              <th className="py-2.5 px-3 font-semibold">Number</th>
              <th className="py-2.5 px-3 font-semibold">Tier Category</th>
              <th className="py-2.5 px-3 font-semibold">Active Status</th>
              <th className="py-2.5 px-3 font-semibold text-right">Coordinates (X, Y)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredSeats.map((seat) => {
              const isSelected = selectedSeatIds.has(seat.id);

              return (
                <tr
                  key={seat.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-brand-50/50' : 'hover:bg-surface-muted/30'
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => selectSeat(seat.id, e.target.checked)}
                      className="rounded border-border accent-brand-600 focus:ring-brand-600 cursor-pointer"
                      aria-label={`Select seat ${seat.label}`}
                    />
                  </td>
                  <td className="py-2.5 px-3 font-bold text-ink">{seat.label}</td>
                  <td className="py-2.5 px-3 text-ink-muted">{seat.rowLabel}</td>
                  <td className="py-2.5 px-3 text-ink-muted">{seat.seatNumber}</td>
                  <td className="py-2.5 px-3">
                    <select
                      value={seat.type}
                      onChange={(e) => {
                        selectSeat(seat.id, false);
                        updateSelectedProperties({ type: e.target.value as SeatType });
                      }}
                      className="rounded border border-border bg-surface px-2 py-1 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                    >
                      {SEAT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        selectSeat(seat.id, false);
                        updateSelectedProperties({ isActive: !seat.isActive });
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium cursor-pointer transition-colors ${
                        seat.isActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          seat.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span>{seat.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-xs text-ink-muted">
                    ({seat.x.toFixed(3)}, {seat.y.toFixed(3)})
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

