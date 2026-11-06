import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  LayoutGrid,
  Columns,
  Footprints,
  Eye,
  Sliders,
} from 'lucide-react';
import { Button, FormErrorBanner } from '@/shared/ui';
import { useBulkCreateSeats } from '../../hooks/useBulkCreateSeats';
import { useUpdateSeatLayout } from '../../hooks/useUpdateSeatLayout';
import {
  SEAT_TYPES,
  SEAT_TYPE_LABELS,
  type BulkCreateSeatsRow,
  type SeatType,
  type Seat,
} from '../../types/seat.types';
import { bulkCreateSeatsSchema } from '../../schemas/bulkCreateSeats.schema';
import { normalizeApiError } from '@/shared/lib/normalizeApiError';
import {
  type LayoutSection,
  type LayoutRow,
  type SectionLayoutConfig,
  SIMPLE_PRESETS,
  MULTI_SECTION_PRESETS,
  computeRowTotalSeats,
  buildPreviewData,
  mapCreatedSeatsToLayoutCoordinates,
} from '../../utils/sectionLayoutGenerator';
import { SeatLayoutPreview } from './SeatLayoutPreview';

export interface SeatLayoutSetupProps {
  theatreId: string;
  screenId: string;
  screenName: string;
  onSetupSuccess: (seats: Seat[]) => void | Promise<void>;
}

type LayoutMode = 'multi-section' | 'simple';

export default function SeatLayoutSetup({
  screenId,
  screenName,
  onSetupSuccess,
}: SeatLayoutSetupProps) {
  const [mode, setMode] = useState<LayoutMode>('multi-section');

  // Simple Mode State
  const [simpleRows, setSimpleRows] = useState<BulkCreateSeatsRow[]>([
    { rowLabel: 'A', seatCount: 10, type: 'PREMIUM' },
    { rowLabel: 'B', seatCount: 10, type: 'REGULAR' },
    { rowLabel: 'C', seatCount: 10, type: 'REGULAR' },
    { rowLabel: 'D', seatCount: 10, type: 'REGULAR' },
  ]);

  // Multi-Section Mode State
  const [sections, setSections] = useState<LayoutSection[]>([
    { id: 'left', name: 'Left', defaultSeatCount: 7 },
    { id: 'centre', name: 'Centre', defaultSeatCount: 14 },
    { id: 'right', name: 'Right', defaultSeatCount: 7 },
  ]);

  const [multiRows, setMultiRows] = useState<LayoutRow[]>([
    {
      id: 'row-1',
      rowLabel: 'A',
      type: 'PREMIUM',
      sectionSeats: { left: 7, centre: 14, right: 7 },
      hasHorizontalAisleAfter: false,
    },
    {
      id: 'row-2',
      rowLabel: 'B',
      type: 'REGULAR',
      sectionSeats: { left: 7, centre: 14, right: 7 },
      hasHorizontalAisleAfter: true,
    },
    {
      id: 'row-3',
      rowLabel: 'C',
      type: 'REGULAR',
      sectionSeats: { left: 7, centre: 14, right: 7 },
      hasHorizontalAisleAfter: false,
    },
    {
      id: 'row-4',
      rowLabel: 'D',
      type: 'REGULAR',
      sectionSeats: { left: 6, centre: 12, right: 6 },
      hasHorizontalAisleAfter: false,
    },
  ]);

  const [verticalAisleSpacing, setVerticalAisleSpacing] = useState<number>(2.0);
  const [horizontalAisleSpacing, setHorizontalAisleSpacing] = useState<number>(1.5);

  const [clientError, setClientError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutations
  const bulkCreateMutation = useBulkCreateSeats(screenId);
  const updateLayoutMutation = useUpdateSeatLayout(screenId);

  // Dynamic preview configuration
  const currentPreviewData = useMemo(() => {
    if (mode === 'simple') {
      const syntheticSection: LayoutSection = {
        id: 'main',
        name: 'Main Seating',
        defaultSeatCount: 10,
      };
      const syntheticRows: LayoutRow[] = simpleRows.map((r, i) => ({
        id: `simple-${i}`,
        rowLabel: r.rowLabel,
        type: r.type,
        sectionSeats: { main: Number(r.seatCount) || 0 },
      }));

      return buildPreviewData({
        sections: [syntheticSection],
        rows: syntheticRows,
        verticalAisleSpacing: 0,
        horizontalAisleSpacing: 0,
      });
    }

    const config: SectionLayoutConfig = {
      sections,
      rows: multiRows,
      verticalAisleSpacing,
      horizontalAisleSpacing,
    };
    return buildPreviewData(config);
  }, [mode, simpleRows, sections, multiRows, verticalAisleSpacing, horizontalAisleSpacing]);

  const totalSeats = currentPreviewData.totalSeats;

  // Simple Mode Actions
  const handleSimpleAddRow = () => {
    setClientError(null);
    setGeneralError(null);

    let nextLetter = 'A';
    if (simpleRows.length > 0) {
      const lastLabel = simpleRows[simpleRows.length - 1].rowLabel;
      const lastChar = lastLabel.charCodeAt(lastLabel.length - 1);
      nextLetter = String.fromCharCode(lastChar + 1);
    }

    setSimpleRows((prev) => [...prev, { rowLabel: nextLetter, seatCount: 10, type: 'REGULAR' }]);
  };

  const handleSimpleRemoveRow = (index: number) => {
    setClientError(null);
    setGeneralError(null);
    if (simpleRows.length <= 1) {
      setClientError('At least one row is required.');
      return;
    }
    setSimpleRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSimpleUpdateRow = (index: number, updates: Partial<BulkCreateSeatsRow>) => {
    setClientError(null);
    setGeneralError(null);
    setSimpleRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
  };

  const handleSimplePreset = (key: keyof typeof SIMPLE_PRESETS) => {
    setClientError(null);
    setGeneralError(null);
    setSimpleRows(SIMPLE_PRESETS[key].rows);
  };

  // Multi-Section Mode Actions
  const handleMultiPreset = (key: keyof typeof MULTI_SECTION_PRESETS) => {
    setClientError(null);
    setGeneralError(null);
    const preset = MULTI_SECTION_PRESETS[key];
    setSections(preset.sections);
    setMultiRows(preset.rows);
  };

  const handleAddSection = () => {
    setClientError(null);
    const newId = `sec-${Date.now()}`;
    const newName = `Section ${sections.length + 1}`;
    const newSection: LayoutSection = { id: newId, name: newName, defaultSeatCount: 6 };

    setSections((prev) => [...prev, newSection]);
    setMultiRows((prev) =>
      prev.map((row) => ({
        ...row,
        sectionSeats: { ...row.sectionSeats, [newId]: 6 },
      })),
    );
  };

  const handleRemoveSection = (sectionId: string) => {
    if (sections.length <= 1) {
      setClientError('At least one seating section is required.');
      return;
    }
    setClientError(null);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setMultiRows((prev) =>
      prev.map((row) => {
        const updated = { ...row.sectionSeats };
        delete updated[sectionId];
        return { ...row, sectionSeats: updated };
      }),
    );
  };

  const handleUpdateSectionName = (sectionId: string, name: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, name: name || 'Section' } : s)),
    );
  };

  const handleMultiAddRow = () => {
    setClientError(null);
    setGeneralError(null);

    let nextLetter = 'A';
    if (multiRows.length > 0) {
      const lastLabel = multiRows[multiRows.length - 1].rowLabel;
      const lastChar = lastLabel.charCodeAt(lastLabel.length - 1);
      nextLetter = String.fromCharCode(lastChar + 1);
    }

    const initialSectionSeats: Record<string, number> = {};
    sections.forEach((s) => {
      initialSectionSeats[s.id] = s.defaultSeatCount;
    });

    const newRow: LayoutRow = {
      id: `row-${Date.now()}`,
      rowLabel: nextLetter,
      type: 'REGULAR',
      sectionSeats: initialSectionSeats,
      hasHorizontalAisleAfter: false,
    };

    setMultiRows((prev) => [...prev, newRow]);
  };

  const handleMultiRemoveRow = (index: number) => {
    setClientError(null);
    setGeneralError(null);
    if (multiRows.length <= 1) {
      setClientError('At least one row is required.');
      return;
    }
    setMultiRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMultiUpdateRow = (index: number, updates: Partial<LayoutRow>) => {
    setClientError(null);
    setGeneralError(null);
    setMultiRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
  };

  const handleMultiUpdateRowSectionSeat = (
    rowIndex: number,
    sectionId: string,
    seatCount: number,
  ) => {
    setClientError(null);
    setGeneralError(null);
    setMultiRows((prev) =>
      prev.map((r, i) =>
        i === rowIndex
          ? {
              ...r,
              sectionSeats: {
                ...r.sectionSeats,
                [sectionId]: Math.max(0, isNaN(seatCount) ? 0 : seatCount),
              },
            }
          : r,
      ),
    );
  };

  // Submission Validation & Execution
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    setGeneralError(null);

    let preparedRows: BulkCreateSeatsRow[];

    if (mode === 'simple') {
      preparedRows = simpleRows.map((r) => ({
        rowLabel: r.rowLabel.trim().toUpperCase(),
        seatCount: Number(r.seatCount),
        type: r.type,
      }));
    } else {
      // Validate multi-section rows
      for (const r of multiRows) {
        const count = computeRowTotalSeats(r, sections);
        if (count < 1) {
          setClientError(
            `Row "${r.rowLabel}" must have at least 1 seat across its sections.`,
          );
          return;
        }
        if (count > 50) {
          setClientError(
            `Row "${r.rowLabel}" exceeds 50 seats total (${count} seats). Reduce seats in sections.`,
          );
          return;
        }
      }

      preparedRows = multiRows.map((r) => ({
        rowLabel: r.rowLabel.trim().toUpperCase(),
        seatCount: computeRowTotalSeats(r, sections),
        type: r.type,
      }));
    }

    // Zod SafeParse
    const result = bulkCreateSeatsSchema.safeParse({ rows: preparedRows });
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      setClientError(firstIssue ? firstIssue.message : 'Invalid row configuration');
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Bulk Create Seats on backend (creates sequential seat numbers per row)
      const createdSeats = await bulkCreateMutation.mutateAsync({ rows: preparedRows });

      if (mode === 'multi-section') {
        // 2. Correlate newly created seats with section layout positions (with vertical & horizontal walking aisles)
        const layoutConfig: SectionLayoutConfig = {
          sections,
          rows: multiRows,
          verticalAisleSpacing,
          horizontalAisleSpacing,
        };
        const mappedCoordinates = mapCreatedSeatsToLayoutCoordinates(createdSeats, layoutConfig);

        // 3. Batch persist the section coordinates to screen seat layout
        const updatedSeats = await updateLayoutMutation.mutateAsync({
          seats: mappedCoordinates,
        });

        await onSetupSuccess(updatedSeats);
      } else {
        // 2. Simple mode: Pack seats as one tight contiguous block at fixed pitch starting at BLOCK_ORIGIN
        const simpleConfig: SectionLayoutConfig = {
          sections: [{ id: 'main', name: 'Main Seating', defaultSeatCount: 10 }],
          rows: simpleRows.map((r, i) => ({
            id: `simple-${i}`,
            rowLabel: r.rowLabel.trim().toUpperCase(),
            type: r.type,
            sectionSeats: { main: Number(r.seatCount) || 0 },
          })),
          verticalAisleSpacing: 0,
          horizontalAisleSpacing: 0,
        };
        const mappedCoordinates = mapCreatedSeatsToLayoutCoordinates(createdSeats, simpleConfig);

        const updatedSeats = await updateLayoutMutation.mutateAsync({
          seats: mappedCoordinates,
        });

        await onSetupSuccess(updatedSeats);
      }
    } catch (err: unknown) {
      const apiErr = normalizeApiError(err);
      let errorMsg = apiErr.message;
      if (apiErr.fieldErrors && Object.keys(apiErr.fieldErrors).length > 0) {
        const details = Object.entries(apiErr.fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        errorMsg = `${apiErr.message}: ${details}`;
      }
      setGeneralError(errorMsg || 'Failed to generate seats. Please check the rows and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LayoutGrid className="text-brand-600" size={24} />
              <h2 className="text-xl font-bold text-ink">Configure Seating Layout</h2>
              <span className="rounded bg-brand-100 text-brand-700 text-[11px] font-bold px-2 py-0.5">
                Section Builder
              </span>
            </div>
            <p className="text-sm text-ink-muted">
              Screen: <span className="font-semibold text-ink">{screenName}</span>. Choose your
              layout blueprint to generate realistic auditorium seating with walking aisles.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-surface-muted/60 px-4 py-2.5 border border-border shrink-0">
            <div className="text-center">
              <span className="block text-xs text-ink-muted font-medium">Rows</span>
              <span className="text-base font-bold text-ink">
                {mode === 'simple' ? simpleRows.length : multiRows.length}
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <span className="block text-xs text-ink-muted font-medium">Sections</span>
              <span className="text-base font-bold text-ink">
                {mode === 'simple' ? 1 : sections.length}
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <span className="block text-xs text-ink-muted font-medium">Total Seats</span>
              <span className="text-base font-bold text-brand-600">{totalSeats}</span>
            </div>
          </div>
        </div>

        {/* Layout Mode Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setMode('multi-section')}
            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
              mode === 'multi-section'
                ? 'border-brand-600 bg-brand-50/40 text-brand-900 shadow-sm ring-1 ring-brand-600'
                : 'border-border bg-surface hover:border-brand-600/40 hover:bg-surface-muted/30 text-ink'
            }`}
          >
            <Columns size={22} className={mode === 'multi-section' ? 'text-brand-600' : 'text-ink-muted'} />
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Layout Type B — Multi-Section Auditorium</span>
                <span className="rounded bg-brand-600 text-[10px] font-bold text-white px-1.5 py-0.5">
                  BookMyShow
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Left, Centre and Right seating sections with vertical walking aisles, horizontal
                cross-aisles and irregular row lengths.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('simple')}
            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
              mode === 'simple'
                ? 'border-brand-600 bg-brand-50/40 text-brand-900 shadow-sm ring-1 ring-brand-600'
                : 'border-border bg-surface hover:border-brand-600/40 hover:bg-surface-muted/30 text-ink'
            }`}
          >
            <LayoutGrid size={22} className={mode === 'simple' ? 'text-brand-600' : 'text-ink-muted'} />
            <div>
              <div className="text-sm font-bold">Layout Type A — Simple Continuous Grid</div>
              <p className="text-xs text-ink-muted mt-0.5">
                One continuous seating block with uniform or custom row lengths.
              </p>
            </div>
          </button>
        </div>

        {/* Blueprint Presets */}
        <div className="pt-4 border-t border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-brand-600" />
            Quick Blueprint Presets ({mode === 'multi-section' ? 'Multi-Section' : 'Simple'})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mode === 'multi-section'
              ? Object.entries(MULTI_SECTION_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleMultiPreset(key)}
                    className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border bg-surface hover:border-brand-600/50 hover:bg-surface-muted/30 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-ink group-hover:text-brand-600">
                      {preset.label}
                    </span>
                    <span className="text-[11px] text-ink-muted">{preset.description}</span>
                  </button>
                ))
              : Object.entries(SIMPLE_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSimplePreset(key)}
                    className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border bg-surface hover:border-brand-600/50 hover:bg-surface-muted/30 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-ink group-hover:text-brand-600">
                      {preset.label}
                    </span>
                    <span className="text-[11px] text-ink-muted">{preset.description}</span>
                  </button>
                ))}
          </div>
        </div>
      </div>

      {/* Live Preview Display (Prominently rendered before generation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Eye size={16} className="text-brand-600" />
            Live Seating Blueprint Preview
          </h3>
          <span className="text-xs text-ink-muted">
            Updates in real-time as you adjust sections, aisles and rows below.
          </span>
        </div>
        <SeatLayoutPreview
          previewData={currentPreviewData}
          screenName={screenName}
        />
      </div>

      {/* Error Banners */}
      <FormErrorBanner message={generalError} />
      {clientError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{clientError}</span>
        </div>
      )}

      {/* Builder Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {mode === 'multi-section' ? (
          /* Multi-Section Configurator */
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-6">
            {/* Section Controls & Walking Aisle Settings */}
            <div className="space-y-4 pb-5 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                    <Columns size={16} className="text-brand-600" />
                    Auditorium Seating Sections ({sections.length})
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Configure columns/sections (e.g., Left, Centre, Right). Vertical walking aisles
                    are placed between each section.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSection}
                  className="flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus size={14} />
                  <span>Add Section</span>
                </Button>
              </div>

              {/* Sections Chips / Rename inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sections.map((sec, index) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border bg-surface-muted/40"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-ink-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={sec.name}
                        onChange={(e) => handleUpdateSectionName(sec.id, e.target.value)}
                        className="w-full rounded border border-transparent hover:border-border focus:border-brand-600 bg-transparent px-1.5 py-1 text-xs font-bold text-ink focus:outline-none"
                        placeholder="Section name"
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sec.id)}
                        className="p-1 text-ink-muted hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove section"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Walking Aisle Width Controls */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
                <div className="flex items-center gap-2 text-ink">
                  <Sliders size={14} className="text-brand-600" />
                  <span className="font-semibold">Vertical Aisle Width:</span>
                  <select
                    value={verticalAisleSpacing}
                    onChange={(e) => setVerticalAisleSpacing(Number(e.target.value))}
                    className="rounded border border-border bg-surface px-2 py-1 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none"
                  >
                    <option value={1.5}>Compact (1.5x)</option>
                    <option value={2.0}>Standard (2.0x)</option>
                    <option value={3.0}>Wide (3.0x)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-ink">
                  <Footprints size={14} className="text-brand-600" />
                  <span className="font-semibold">Horizontal Cross-Aisle Gap:</span>
                  <select
                    value={horizontalAisleSpacing}
                    onChange={(e) => setHorizontalAisleSpacing(Number(e.target.value))}
                    className="rounded border border-border bg-surface px-2 py-1 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none"
                  >
                    <option value={1.2}>Compact (1.2x)</option>
                    <option value={1.5}>Standard (1.5x)</option>
                    <option value={2.2}>Wide (2.2x)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row Grid Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ink">Row-by-Row Section Matrix</h3>
                  <p className="text-xs text-ink-muted">
                    Configure seats for each section per row. Enter 0 to leave a section empty in
                    that row.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleMultiAddRow}
                  className="flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add Row</span>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border text-ink-muted">
                      <th className="pb-3 font-semibold w-12">#</th>
                      <th className="pb-3 font-semibold w-24">Row</th>
                      <th className="pb-3 font-semibold w-36">Seat Tier</th>
                      {sections.map((sec) => (
                        <th key={sec.id} className="pb-3 font-semibold text-center px-2">
                          {sec.name} Seats
                        </th>
                      ))}
                      <th className="pb-3 font-semibold text-center w-32">Walking Cross-Aisle</th>
                      <th className="pb-3 font-semibold text-right w-20">Row Total</th>
                      <th className="pb-3 font-semibold w-14 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {multiRows.map((row, index) => {
                      const rowTotal = computeRowTotalSeats(row, sections);

                      return (
                        <tr key={row.id} className="group hover:bg-surface-muted/20">
                          <td className="py-2.5 font-medium text-ink-muted">{index + 1}</td>
                          <td className="py-2.5 pr-2">
                            <input
                              type="text"
                              maxLength={10}
                              value={row.rowLabel}
                              onChange={(e) =>
                                handleMultiUpdateRow(index, {
                                  rowLabel: e.target.value.toUpperCase(),
                                })
                              }
                              className="w-16 rounded border border-border bg-surface px-2 py-1 text-xs font-bold text-ink uppercase tracking-wider focus:border-brand-600 focus:outline-none"
                              placeholder="A"
                            />
                          </td>
                          <td className="py-2.5 pr-2">
                            <select
                              value={row.type}
                              onChange={(e) =>
                                handleMultiUpdateRow(index, { type: e.target.value as SeatType })
                              }
                              className="rounded border border-border bg-surface px-2 py-1 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none"
                            >
                              {SEAT_TYPES.map((seatType) => (
                                <option key={seatType} value={seatType}>
                                  {SEAT_TYPE_LABELS[seatType]}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Per-Section Seat Inputs */}
                          {sections.map((sec) => (
                            <td key={sec.id} className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={50}
                                value={row.sectionSeats[sec.id] ?? 0}
                                onChange={(e) =>
                                  handleMultiUpdateRowSectionSeat(
                                    index,
                                    sec.id,
                                    parseInt(e.target.value, 10),
                                  )
                                }
                                className="w-16 rounded border border-border bg-surface px-2 py-1 text-xs text-center font-semibold text-ink focus:border-brand-600 focus:outline-none"
                              />
                            </td>
                          ))}

                          {/* Horizontal Cross-Aisle Toggle */}
                          <td className="py-2.5 text-center">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-ink-muted hover:text-ink">
                              <input
                                type="checkbox"
                                checked={row.hasHorizontalAisleAfter || false}
                                onChange={(e) =>
                                  handleMultiUpdateRow(index, {
                                    hasHorizontalAisleAfter: e.target.checked,
                                  })
                                }
                                className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-600 cursor-pointer"
                              />
                              <span className="text-[11px]">Aisle below</span>
                            </label>
                          </td>

                          {/* Row Total */}
                          <td className="py-2.5 text-right font-bold text-ink pr-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                rowTotal > 50
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-surface-muted text-ink'
                              }`}
                            >
                              {rowTotal}
                            </span>
                          </td>

                          {/* Remove Row */}
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleMultiRemoveRow(index)}
                              disabled={multiRows.length <= 1}
                              className="rounded p-1.5 text-ink-muted hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Remove row"
                              aria-label={`Remove row ${row.rowLabel}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Simple Mode Configurator */
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <LayoutGrid size={16} className="text-brand-600" />
                Row Configurations
              </h3>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSimpleAddRow}
                className="flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Row</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-ink-muted">
                    <th className="pb-3 font-semibold w-16">#</th>
                    <th className="pb-3 font-semibold w-32">Row Label</th>
                    <th className="pb-3 font-semibold w-36">Seats (1–50)</th>
                    <th className="pb-3 font-semibold">Seat Tier</th>
                    <th className="pb-3 font-semibold w-16 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {simpleRows.map((row, index) => (
                    <tr key={index} className="group hover:bg-surface-muted/20">
                      <td className="py-2.5 font-medium text-ink-muted">{index + 1}</td>
                      <td className="py-2.5 pr-3">
                        <input
                          type="text"
                          maxLength={10}
                          value={row.rowLabel}
                          onChange={(e) =>
                            handleSimpleUpdateRow(index, {
                              rowLabel: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-24 rounded border border-border bg-surface px-2.5 py-1.5 text-xs font-bold text-ink uppercase tracking-wider focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                          placeholder="A"
                        />
                      </td>
                      <td className="py-2.5 pr-3">
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={row.seatCount}
                          onChange={(e) =>
                            handleSimpleUpdateRow(index, { seatCount: Number(e.target.value) })
                          }
                          className="w-24 rounded border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                        />
                      </td>
                      <td className="py-2.5 pr-3">
                        <select
                          value={row.type}
                          onChange={(e) =>
                            handleSimpleUpdateRow(index, { type: e.target.value as SeatType })
                          }
                          className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                        >
                          {SEAT_TYPES.map((seatType) => (
                            <option key={seatType} value={seatType}>
                              {SEAT_TYPE_LABELS[seatType]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSimpleRemoveRow(index)}
                          disabled={simpleRows.length <= 1}
                          className="rounded p-1.5 text-ink-muted hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Remove row"
                          aria-label={`Remove row ${row.rowLabel}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
          <div className="text-xs text-ink-muted space-y-0.5">
            <p className="font-semibold text-ink">
              Ready to generate {totalSeats} seats across{' '}
              {mode === 'multi-section' ? multiRows.length : simpleRows.length} rows.
            </p>
            <p>
              Max 50 seats/row, max 1000 seats per screen. Walking aisles remain real empty
              coordinates.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || totalSeats === 0 || totalSeats > 1000}
            className="min-w-[190px] shadow-sm"
          >
            {isSubmitting ? 'Generating Seats...' : 'Generate Seat Grid'}
          </Button>
        </div>
      </form>
    </div>
  );
}
