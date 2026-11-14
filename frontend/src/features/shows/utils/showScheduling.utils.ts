import type { ShowListItem } from '../types/show.types';

export interface ScheduleConflictEvaluation {
  hasConflict: boolean;
  cleaningBufferMinutes: number;
  conflictingShow: ShowListItem | null;
  previousShow: ShowListItem | null;
  nextAvailableTime: Date | null;
}

export function combineDateAndTime(showDate: string, showTime: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(showDate) || !/^\d{2}:\d{2}$/.test(showTime)) {
    return null;
  }

  const [year, month, day] = showDate.split('-').map(Number);
  const [hours, minutes] = showTime.split(':').map(Number);

  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function calculateShowEndTime(
  startTime: Date | null,
  durationMinutes: number | undefined,
): Date | null {
  if (!startTime || !durationMinutes || durationMinutes <= 0) {
    return null;
  }

  return new Date(startTime.getTime() + durationMinutes * 60_000);
}

export function formatShowDisplayDate(showDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(showDate)) return '—';
  const [year, month, day] = showDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShowTime12h(date: Date | string | null): string {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function evaluateScreenScheduleSlot(params: {
  startTime: Date | null;
  endTime: Date | null;
  cleaningBufferMinutes?: number;
  existingShows: ShowListItem[];
  excludeShowId?: string;
}): ScheduleConflictEvaluation {
  const cleaningBufferMinutes = Math.max(0, params.cleaningBufferMinutes ?? 15);
  const bufferMs = cleaningBufferMinutes * 60_000;

  const activeShows = params.existingShows
    .filter((s) => s.id !== params.excludeShowId)
    .filter((s) => s.status === 'DRAFT' || s.status === 'PUBLISHED')
    .sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  if (!params.startTime || !params.endTime) {
    return {
      hasConflict: false,
      cleaningBufferMinutes,
      conflictingShow: null,
      previousShow: null,
      nextAvailableTime: null,
    };
  }

  const candidateStartMs = params.startTime.getTime();
  const candidateEndMs = params.endTime.getTime();

  let conflictingShow: ShowListItem | null = null;
  let previousShow: ShowListItem | null = null;

  for (const show of activeShows) {
    const existingStartMs = new Date(show.startTime).getTime();
    const existingEndMs = new Date(show.endTime).getTime();

    const overlapsWithBuffer =
      existingStartMs < candidateEndMs + bufferMs &&
      existingEndMs > candidateStartMs - bufferMs;

    if (overlapsWithBuffer && !conflictingShow) {
      conflictingShow = show;
    }

    if (existingEndMs <= candidateStartMs) {
      if (
        !previousShow ||
        existingEndMs > new Date(previousShow.endTime).getTime()
      ) {
        previousShow = show;
      }
    }
  }

  const referenceShow = conflictingShow ?? previousShow;
  const nextAvailableTime = referenceShow
    ? new Date(new Date(referenceShow.endTime).getTime() + bufferMs)
    : null;

  return {
    hasConflict: Boolean(conflictingShow),
    cleaningBufferMinutes,
    conflictingShow,
    previousShow,
    nextAvailableTime,
  };
}

