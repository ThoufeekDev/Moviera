import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export interface SelectedLocationCardProps {
  selectedPlaceId?: string | null;
  selectedAddress?: string | null;
  onSearchAnother?: () => void;
}

export function SelectedLocationCard({
  selectedPlaceId,
  selectedAddress,
  onSearchAnother,
}: SelectedLocationCardProps) {
  if (!selectedAddress && !selectedPlaceId) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-300/80 bg-emerald-50/60 p-3.5 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200">
      <div className="flex items-start gap-2.5">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-semibold block text-emerald-950 dark:text-emerald-100">
            Location Selected
          </span>
          {selectedAddress && <p className="mt-0.5 line-clamp-1 text-ink">{selectedAddress}</p>}
          {selectedPlaceId && (
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
              <span>Place ID:</span>
              <span className="rounded bg-surface-muted px-1.5 py-0.5 font-semibold text-ink">
                {selectedPlaceId}
              </span>
            </div>
          )}
        </div>
      </div>

      {onSearchAnother && (
        <div className="shrink-0 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSearchAnother}
            className="text-xs h-8 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Search Another</span>
          </Button>
        </div>
      )}
    </div>
  );
}
