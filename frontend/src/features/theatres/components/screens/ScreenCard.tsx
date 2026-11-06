import { useNavigate } from 'react-router-dom';
import { Armchair, Clapperboard, Rows3, Settings2 } from 'lucide-react';
import { Badge, Button } from '@/shared/ui';
import type { ScreenListItem } from '../../types/screen.types';

export interface ScreenCardProps {
  screen: ScreenListItem;
}

export default function ScreenCard({ screen }: ScreenCardProps) {
  const navigate = useNavigate();
  const isConfigured = screen.seatConfigurationStatus === 'CONFIGURED';

  return (
    <article className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-colors hover:border-brand-600/40">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-ink" title={screen.name}>
              {screen.name}
            </h3>
            <p className="truncate text-xs text-ink-muted" title={screen.slug}>
              ID: {screen.slug}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant={screen.isActive ? 'success' : 'secondary'} size="sm">
              {screen.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Seat Configuration Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {isConfigured ? 'Layout Configured' : 'No Seats Configured'}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <Armchair size={15} className="text-ink-muted shrink-0" aria-hidden="true" />
          <dt className="sr-only">Total seats</dt>
          <dd className="truncate text-ink">
            <span className="font-semibold">{screen.totalSeats}</span>{' '}
            <span className="text-ink-muted">{screen.totalSeats === 1 ? 'Seat' : 'Seats'}</span>
          </dd>
        </div>

        <div className="flex items-center gap-1.5">
          <Rows3 size={15} className="text-ink-muted shrink-0" aria-hidden="true" />
          <dt className="sr-only">Total rows</dt>
          <dd className="truncate text-ink">
            <span className="font-semibold">{screen.totalRows ?? 0}</span>{' '}
            <span className="text-ink-muted">Rows</span>
          </dd>
        </div>

        <div className="flex items-center gap-1.5">
          <Clapperboard size={15} className="text-ink-muted shrink-0" aria-hidden="true" />
          <dt className="sr-only">Total shows</dt>
          <dd className="truncate text-ink">
            <span className="font-semibold">{screen.totalShows}</span>{' '}
            <span className="text-ink-muted">{screen.totalShows === 1 ? 'Show' : 'Shows'}</span>
          </dd>
        </div>
      </dl>

      <div className="pt-2 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
          onClick={() =>
            navigate(`/theatre-admin/theatres/${screen.theatreId}/screens/${screen.id}/seats`)
          }
          className="flex items-center justify-center gap-2 font-medium hover:border-brand-600 hover:text-brand-600"
          aria-label={`Manage seats for ${screen.name}`}
        >
          <Settings2 size={14} aria-hidden="true" />
          <span>Manage Seats</span>
        </Button>
      </div>
    </article>
  );
}
