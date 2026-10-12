import type { ReactNode } from 'react';
import type { Theatre } from '../types/theatre.types';

interface TheatreHeaderProps {
  theatre: Theatre;
  children: ReactNode;
}

export default function TheatreHeader({ theatre, children }: TheatreHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-white/10 bg-nav p-6 sm:p-8 text-nav-ink shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white/5">
          {theatre.logoUrl ? (
            <img
              src={theatre.logoUrl}
              alt={`${theatre.name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center text-nav-ink/60">
              <svg
                width="28"
                height="28"
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
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {theatre.name}
            </h1>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                theatre.isActive
                  ? 'border border-success-500/30 bg-success-500/20 text-emerald-300'
                  : 'border border-danger-600/30 bg-danger-600/20 text-rose-300'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  theatre.isActive ? 'bg-success-500' : 'bg-danger-600'
                }`}
              />
              {theatre.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-xs md:text-sm text-nav-ink/70">
            <svg
              width="14"
              height="14"
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
            {theatre.city?.name} {theatre.city?.state}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">{children}</div>
    </div>
  );
}