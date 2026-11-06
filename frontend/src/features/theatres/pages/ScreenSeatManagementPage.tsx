import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  Armchair,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { ContentLoader, ErrorState, FormErrorBanner } from '@/shared/ui';
import { theatreKeys } from '../keys';
import { useTheatreOverview } from '../hooks/useTheatreOverview';
import { useScreens } from '../hooks/useScreens';
import { useScreenSeatLayout } from '../hooks/useScreenSeatLayout';
import { useUpdateSeatLayout } from '../hooks/useUpdateSeatLayout';
import { useUpdateSeatProperties } from '../hooks/useUpdateSeatProperties';
import { useSeatEditorStore, selectIsDirty } from '../stores/useSeatEditorStore';
import SeatLayoutSetup from '../components/seats/SeatLayoutSetup';
import { SeatCanvas } from '../components/seats/SeatCanvas';
import { SeatTableView } from '../components/seats/SeatTableView';
import { SeatEditorToolbar } from '../components/seats/SeatEditorToolbar';
import { normalizeApiError } from '@/shared/lib/normalizeApiError';
import { repackSeatsLayout } from '../utils/sectionLayoutGenerator';
import {
  computeContentRect,
  computeFitView,
  normalizedToWorld,
} from '../utils/seatCoordinates';

export default function ScreenSeatManagementPage() {
  const { theatreId, screenId } = useParams<{ theatreId: string; screenId: string }>();
  const queryClient = useQueryClient();
  const initializedSeatsRef = useRef<unknown>(null);

  const [viewMode, setViewMode] = useState<'canvas' | 'table'>('canvas');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [handToolActive, setHandToolActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Measure container for canvas stage with ResizeObserver
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1100, height: 700 });

  // Data queries
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useTheatreOverview(theatreId || '');

  const {
    data: screensData,
    isLoading: isScreensLoading,
  } = useScreens(theatreId || '', { limit: 100 });

  const {
    data: layoutSeats,
    isLoading: isLayoutLoading,
    isError: isLayoutError,
    error: layoutError,
    refetch: refetchLayout,
  } = useScreenSeatLayout(screenId || '');

  // Mutations
  const updateLayoutMutation = useUpdateSeatLayout(screenId || '');
  const updatePropertiesMutation = useUpdateSeatProperties(screenId || '');

  // Zustand Store
  const storeSeats = useSeatEditorStore((s) => s.seats);
  const initialSeats = useSeatEditorStore((s) => s.initialSeats);
  const initEditor = useSeatEditorStore((s) => s.initEditor);
  const markSaved = useSeatEditorStore((s) => s.markSaved);
  const batchUpdatePositions = useSeatEditorStore((s) => s.batchUpdatePositions);
  const setZoom = useSeatEditorStore((s) => s.setZoom);
  const setPan = useSeatEditorStore((s) => s.setPan);
  const isDirty = useSeatEditorStore(selectIsDirty);

  const theatre = overview?.theatre;
  const currentScreen = screensData?.items?.find((s) => s.id === screenId);
  const screenName = currentScreen?.name || 'Screen';

  const handleRepackRows = () => {
    const repacked = repackSeatsLayout(storeSeats);
    if (repacked.length > 0) {
      batchUpdatePositions(repacked);
    }
  };

  const handleFitView = () => {
    const rect = computeContentRect(storeSeats.map((s) => normalizedToWorld(s.x, s.y)));
    if (!rect) return;
    const fit = computeFitView(rect, canvasDimensions.width, canvasDimensions.height);
    setZoom(fit.zoom);
    setPan(fit.pan);
  };

  // Initialize store when layout seats are fetched from server
  useEffect(() => {
    if (
      layoutSeats &&
      layoutSeats.length > 0 &&
      theatreId &&
      screenId &&
      initializedSeatsRef.current !== layoutSeats
    ) {
      initializedSeatsRef.current = layoutSeats;
      initEditor(theatreId, screenId, screenName, layoutSeats);
    }
  }, [layoutSeats, theatreId, screenId, screenName, initEditor]);

  // Resize observer to keep canvas dimensions responsive
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasDimensions({
          width: Math.max(750, clientWidth),
          height: Math.max(550, clientHeight || 600),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [viewMode, isFullscreen]);

  // Exit fullscreen on Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Browser navigation warning when unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Save Pipeline
  const handleSave = async () => {
    if (!isDirty || isSaving || !screenId) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccessMsg(null);

    const initialMap = new Map(initialSeats.map((s) => [s.id, s]));

    // Find position changes
    const positionUpdates = storeSeats
      .filter((s) => {
        const init = initialMap.get(s.id);
        if (!init) return true;
        return (
          Math.abs(init.x - s.x) > 0.0001 ||
          Math.abs(init.y - s.y) > 0.0001 ||
          init.rotation !== s.rotation
        );
      })
      .map((s) => ({
        seatId: s.id,
        x: Math.max(0, Math.min(1, Math.round(s.x * 10000) / 10000)),
        y: Math.max(0, Math.min(1, Math.round(s.y * 10000) / 10000)),
        rotation: typeof s.rotation === 'number' ? Math.round(s.rotation) : 0,
      }));

    // Find property changes (type or isActive)
    const propertyUpdates = storeSeats
      .filter((s) => {
        const init = initialMap.get(s.id);
        if (!init) return true;
        return init.type !== s.type || init.isActive !== s.isActive;
      })
      .map((s) => ({
        seatId: s.id,
        type: s.type,
        isActive: s.isActive,
      }));

    try {
      // Execute position updates if any
      if (positionUpdates.length > 0) {
        await updateLayoutMutation.mutateAsync({ seats: positionUpdates });
      }

      // Execute atomic property updates if any
      if (propertyUpdates.length > 0) {
        await updatePropertiesMutation.mutateAsync({ seats: propertyUpdates });
      }

      markSaved(storeSeats);
      initializedSeatsRef.current = storeSeats;
      queryClient.setQueryData(theatreKeys.seatLayout(screenId), storeSeats);
      setSaveSuccessMsg(
        `Successfully saved layout: ${positionUpdates.length} positions and ${propertyUpdates.length} properties updated.`,
      );
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const apiErr = normalizeApiError(err);
      let errorMsg = apiErr.message;
      if (apiErr.code === 'CONFLICT') {
        errorMsg = apiErr.message || 'Screen is inactive or seats are currently in conflict.';
      } else if (apiErr.code === 'FORBIDDEN') {
        errorMsg = 'You are not authorized to modify seat configurations for this screen.';
      } else if (apiErr.code === 'NOT_FOUND') {
        errorMsg = 'The requested screen or seats could not be found.';
      } else if (apiErr.fieldErrors && Object.keys(apiErr.fieldErrors).length > 0) {
        const details = Object.entries(apiErr.fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        errorMsg = `${apiErr.message}: ${details}`;
      }
      setSaveError(errorMsg || 'Failed to save seat layout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading State
  if (isOverviewLoading || isScreensLoading || isLayoutLoading) {
    return <ContentLoader subtext="Loading screen and seat configuration..." minHeight="500px" />;
  }

  // Error State
  if (isOverviewError || isLayoutError) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <ErrorState
          title="Failed to load screen seat layout"
          message={layoutError instanceof Error ? layoutError.message : 'Please check your connection and retry.'}
          onRetry={() => refetchLayout()}
        />
      </div>
    );
  }

  // Setup Mode (Screen has 0 seats)
  if (!layoutSeats || layoutSeats.length === 0) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Link
            to="/theatre-admin/theatres"
            className="hover:text-ink hover:underline flex items-center gap-1"
          >
            <Building2 size={13} />
            <span>Theatres</span>
          </Link>
          <span>/</span>
          <Link
            to={`/theatre-admin/theatres/${theatreId}`}
            className="hover:text-ink hover:underline"
          >
            {theatre?.name || 'Theatre'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-ink">{screenName} Seats Setup</span>
        </div>

        <SeatLayoutSetup
          theatreId={theatreId!}
          screenId={screenId!}
          screenName={screenName}
          onSetupSuccess={async (newSeats) => {
            const { data: freshSeats } = await refetchLayout();
            const resolvedSeats =
              freshSeats && freshSeats.length > 0 ? freshSeats : newSeats;
            initializedSeatsRef.current = resolvedSeats;
            initEditor(theatreId!, screenId!, screenName, resolvedSeats);
            queryClient.setQueryData(theatreKeys.seatLayout(screenId!), resolvedSeats);
          }}
        />
      </div>
    );
  }

  // Editor Mode (Seats Configured)
  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-page p-4 space-y-3 flex flex-col overflow-hidden'
          : 'mx-auto max-w-7xl p-4 sm:p-6 space-y-4 flex flex-col min-h-[calc(100vh-80px)]'
      }
    >
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Link
              to={`/theatre-admin/theatres/${theatreId}`}
              className="hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Back to {theatre?.name || 'Theatre'}</span>
            </Link>
            <span>/</span>
            <span className="font-medium text-ink">{screenName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Armchair className="text-brand-600" size={20} />
            <h1 className="text-xl font-bold text-ink">
              {screenName} — Seating Layout Editor
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Draft Changes
            </span>
          )}
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-in fade-in duration-150">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      <FormErrorBanner message={saveError} />

      {/* Editor Toolbar */}
      <SeatEditorToolbar
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onSave={handleSave}
        isSaving={isSaving}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid((prev) => !prev)}
        onRepackRows={handleRepackRows}
        handToolActive={handToolActive}
        onToggleHandTool={() => setHandToolActive((prev) => !prev)}
        onFitView={handleFitView}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />

      {/* Main Workspace (Canvas or Table) */}
      <div ref={containerRef} className="flex-1 w-full min-h-[550px] relative">
        {viewMode === 'canvas' ? (
          <SeatCanvas
            containerWidth={canvasDimensions.width}
            containerHeight={canvasDimensions.height}
            snapToGrid={snapToGrid}
            handToolActive={handToolActive}
          />
        ) : (
          <SeatTableView />
        )}
      </div>
    </div>
  );
}
