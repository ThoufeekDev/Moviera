import { Armchair, Clapperboard } from 'lucide-react';
import { Badge } from '@/shared/ui';
import type { ScreenListItem } from '../../types/screen.types';

export interface ScreenCardProps {
  screen: ScreenListItem;
}

export default function ScreenCard({ screen }: ScreenCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-colors hover:border-brand-600/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink" title={screen.name}>
            {screen.name}
          </h3>
          <p className="truncate text-xs text-ink-muted" title={screen.slug}>
            ID: {screen.slug}
          </p>
        </div>
        <Badge variant={screen.isActive ? 'success' : 'secondary'} size="sm">
          {screen.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div className="flex items-center gap-2">
          <Armchair size={16} className="text-ink-muted" aria-hidden="true" />
          <dt className="sr-only">Total seats</dt>
          <dd className="text-ink">
            <span className="font-semibold">{screen.totalSeats}</span>{' '}
            <span className="text-ink-muted">{screen.totalSeats === 1 ? 'Seat' : 'Seats'}</span>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Clapperboard size={16} className="text-ink-muted" aria-hidden="true" />
          <dt className="sr-only">Total shows</dt>
          <dd className="text-ink">
            <span className="font-semibold">{screen.totalShows}</span>{' '}
            <span className="text-ink-muted">{screen.totalShows === 1 ? 'Show' : 'Shows'}</span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
