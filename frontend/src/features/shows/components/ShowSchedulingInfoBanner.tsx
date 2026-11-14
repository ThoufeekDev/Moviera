import { AlertTriangle, CalendarCheck2, CheckCircle2 } from 'lucide-react';
import {
  formatShowTime12h,
  type ScheduleConflictEvaluation,
} from '../utils/showScheduling.utils';

export interface ShowSchedulingInfoBannerProps {
  evaluation: ScheduleConflictEvaluation;
  isChecking: boolean;
  hasScreenAndTiming: boolean;
}

export default function ShowSchedulingInfoBanner({
  evaluation,
  isChecking,
  hasScreenAndTiming,
}: ShowSchedulingInfoBannerProps) {
  const {
    hasConflict,
    cleaningBufferMinutes,
    conflictingShow,
    previousShow,
    nextAvailableTime,
  } = evaluation;

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <CalendarCheck2 className="h-4 w-4 text-ink/70" aria-hidden="true" />
        <span>Scheduling Information</span>
      </div>

      {!hasScreenAndTiming ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-surface-muted/60 px-4 py-3 text-xs text-ink/70">
          <span>
            Select a movie, screen, show date, and start time to verify screen availability.
          </span>
        </div>
      ) : isChecking ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-surface-muted/60 px-4 py-3 text-xs text-ink/70">
          <span>Checking screen schedule and cleaning buffer...</span>
        </div>
      ) : hasConflict && conflictingShow ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger-600/30 bg-brand-50 px-4 py-3"
        >
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-danger-600"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-0.5 text-xs">
            <p className="font-semibold text-danger-600">
              Scheduling conflict detected
            </p>
            <p className="text-ink/80">
              Overlaps with{' '}
              <span className="font-medium text-ink">
                {conflictingShow.movie.title}
              </span>{' '}
              ({formatShowTime12h(conflictingShow.startTime)} –{' '}
              {formatShowTime12h(conflictingShow.endTime)}) · {cleaningBufferMinutes}{' '}
              min cleaning buffer
              {nextAvailableTime
                ? ` · Next available from ${formatShowTime12h(nextAvailableTime)}`
                : ''}
            </p>
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="flex items-start gap-3 rounded-md border border-success-500/30 bg-success-500/10 px-4 py-3"
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-success-700"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-0.5 text-xs">
            <p className="font-semibold text-success-700">
              No scheduling conflicts
            </p>
            <p className="text-success-700/90">
              {previousShow && nextAvailableTime
                ? `Previous show ends at ${formatShowTime12h(previousShow.endTime)} · ${cleaningBufferMinutes} min cleaning buffer · Next available from ${formatShowTime12h(nextAvailableTime)}`
                : `Screen is available for this slot · ${cleaningBufferMinutes} min cleaning buffer applied between shows`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

