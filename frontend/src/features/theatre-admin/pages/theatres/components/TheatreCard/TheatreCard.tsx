import type { Theatre } from '../../types/theatre.type';
import { Button } from '@/shared/ui/Button';

interface TheatreCardProps {
  theatre: Theatre;
  onManage: (theatreId: string) => void;
}

const TheatreCard = ({ theatre, onManage }: TheatreCardProps) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md">
      {/* Top Banner / Header Decoration */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            theatre.isActive
              ? 'border border-emerald-200/60 bg-emerald-50 text-emerald-700'
              : 'border border-rose-200/60 bg-rose-50 text-rose-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              theatre.isActive ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]' : 'bg-rose-500'
            }`}
          />
          {theatre.isActive ? 'Active' : 'Inactive'}
        </span>

        {theatre.licenseNumber && (
          <span
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
            title={`License: ${theatre.licenseNumber}`}
          >
            <svg
              className="h-3 w-3 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {theatre.licenseNumber}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {theatre.logoUrl ? (
              <img
                src={theatre.logoUrl}
                alt={`${theatre.name} logo`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-brand-500 transition-colors">
              {theatre.name}
            </h3>
            {theatre.city && (
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {theatre.city.name}, {theatre.city.state}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="line-clamp-2 leading-relaxed">{theatre.address}</span>
          </div>

          {(theatre.email || theatre.phone) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
              {theatre.email && (
                <span className="inline-flex items-center gap-1.5" title={theatre.email}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {theatre.email}
                </span>
              )}
              {theatre.phone && (
                <span className="inline-flex items-center gap-1.5" title={theatre.phone}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {theatre.phone}
                </span>
              )}
            </div>
          )}

          {theatre.description && (
            <p className="line-clamp-2 leading-relaxed text-slate-500">{theatre.description}</p>
          )}
        </div>

        <div className="mt-5 pt-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => onManage(theatre.id)}
            className="gap-2 border-slate-200 font-semibold group-hover:border-brand-500 group-hover:bg-brand-50 group-hover:text-brand-600"
          >
            <span>Manage Theatre</span>
            <svg
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
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