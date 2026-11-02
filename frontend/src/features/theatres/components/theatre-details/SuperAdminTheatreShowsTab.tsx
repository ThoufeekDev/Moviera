import { CalendarClock, Sparkles, Clock, AlertCircle } from 'lucide-react';
import type { SuperAdminTheatreDetail } from '../../types/superAdminTheatreDetail.types';

interface SuperAdminTheatreShowsTabProps {
  theatre: SuperAdminTheatreDetail;
}

export default function SuperAdminTheatreShowsTab({
  theatre,
}: SuperAdminTheatreShowsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Overview status banner */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <CalendarClock size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Shows &amp; Timings</h2>
            <p className="text-xs text-ink-muted">
              Live schedule monitoring for {theatre.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink">
            Scheduled Today: <strong className="text-sky-600">{theatre.statistics.todayShows}</strong>
          </span>
        </div>
      </div>

      {/* Coming soon illustration card */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-12 text-center shadow-card">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-brand-500/10 text-sky-600 border border-sky-500/20 shadow-sm">
          <Clock size={32} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
            <Sparkles size={10} />
          </span>
        </div>

        <h3 className="mt-5 text-lg font-bold text-ink">
          Interactive Show Scheduling Coming Soon
        </h3>

        <p className="mt-2 text-xs text-ink-muted max-w-md leading-relaxed">
          Comprehensive super-admin show calendar view, reel assignments, and timetable management are currently under development. Real-time show metrics ({theatre.statistics.todayShows} shows today) are actively synced from live database records.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-surface-muted/60 px-4 py-2 text-xs text-ink-muted">
          <AlertCircle size={14} className="text-sky-600 shrink-0" />
          <span>Detailed show listings by theatre will be unlocked in the next release.</span>
        </div>
      </div>
    </div>
  );
}
