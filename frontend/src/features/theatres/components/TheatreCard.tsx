import type { Theatre } from '../types/theatre.types';
import { Button } from '@/shared/ui/Button';

interface TheatreCardProps {
  theatre: Theatre;
  onManage: (theatreId: string) => void;
}

const TheatreCard = ({ theatre, onManage }: TheatreCardProps) => {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-all duration-150 hover:border-ink-muted">
      {/* Top Banner / Header Decoration */}
      <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            theatre.isActive
              ? 'border-success-500/20 bg-emerald-50 text-success-700'
              : 'border-brand-100 bg-brand-50 text-danger-600'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              theatre.isActive ? 'bg-success-500' : 'bg-danger-600'
            }`}
          />
          {theatre.isActive ? 'Active' : 'Inactive'}
        </span>

        {theatre.licenseNumber && (
          <span
            className="inline-flex items-center gap-1 text-xs text-ink-muted"
            title={`License: ${theatre.licenseNumber}`}
          >
            <svg
              className="h-3 w-3 text-ink-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="truncate max-w-[120px]">{theatre.licenseNumber}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface-muted">
            {theatre.logoUrl ? (
              <img
                src={theatre.logoUrl}
                alt={`${theatre.name} logo`}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-muted">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="truncate text-base font-medium text-ink group-hover:text-brand-600 transition-colors">
              {theatre.name}
            </h3>
            {theatre.city && (
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-muted">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {theatre.city.name}, {theatre.city.state}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2 border-t border-border pt-3 text-xs md:text-sm text-ink-muted">
          <div className="flex items-start gap-1.5">
            <svg
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="line-clamp-2 leading-relaxed">{theatre.address}</span>
          </div>

          {(theatre.email || theatre.phone) && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
              {theatre.email && (
                <span className="inline-flex items-center gap-1 truncate max-w-[180px]" title={theatre.email}>
                  ✉ {theatre.email}
                </span>
              )}
              {theatre.phone && (
                <span className="inline-flex items-center gap-1" title={theatre.phone}>
                  ☎ {theatre.phone}
                </span>
              )}
            </div>
          )}

          {theatre.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-ink-muted">{theatre.description}</p>
          )}
        </div>

        <div className="mt-5 pt-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => onManage(theatre.id)}
          >
            <span>Manage Theatre</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default TheatreCard;