import type { Movie, MovieTheatreFormat } from '@/features/movies';
import type { ScreenListItem, Theatre } from '@/features/theatres';
import { cn } from '@/shared/lib/cn';
import {
  Calendar,
  ChevronDown,
  Clapperboard,
  Clock,
  Film,
  Info,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { CreateShowFormValues } from '../schemas/createShowForm.schema';
import {
  formatShowTime12h,
  type ScheduleConflictEvaluation,
} from '../utils/showScheduling.utils';
import ShowSchedulingInfoBanner from './ShowSchedulingInfoBanner';

export interface ShowDetailsSectionProps {
  theatres: Theatre[];
  movies: Movie[];
  screens: ScreenListItem[];
  compatibleFormats: MovieTheatreFormat[];
  selectedMovie: Movie | undefined;
  selectedScreen: ScreenListItem | undefined;
  endTimeDate: Date | null;
  scheduleEvaluation: ScheduleConflictEvaluation;
  isCheckingSchedule: boolean;
  isLoadingScreens: boolean;
  hideTheatreSelect?: boolean;
}

export default function ShowDetailsSection({
  theatres,
  movies,
  screens,
  compatibleFormats,
  selectedMovie,
  selectedScreen,
  endTimeDate,
  scheduleEvaluation,
  isCheckingSchedule,
  isLoadingScreens,
  hideTheatreSelect = false,
}: ShowDetailsSectionProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateShowFormValues>();

  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [isScreenDropdownOpen, setIsScreenDropdownOpen] = useState(false);
  const [movieSearch, setMovieSearch] = useState('');

  const movieDropdownRef = useRef<HTMLDivElement>(null);
  const screenDropdownRef = useRef<HTMLDivElement>(null);

  const cinemaFormatId = watch('cinemaFormatId');
  const showDate = watch('showDate');
  const showTime = watch('showTime');

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        movieDropdownRef.current &&
        !movieDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMovieDropdownOpen(false);
      }
      if (
        screenDropdownRef.current &&
        !screenDropdownRef.current.contains(event.target as Node)
      ) {
        setIsScreenDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(movieSearch.trim().toLowerCase()),
  );

  const formatMovieMeta = (movie: Movie): string => {
    const languages = movie.languages?.map((l) => l.name).join(', ') || 'Multi-language';
    const genres =
      movie.genres && movie.genres.length > 0
        ? movie.genres.map((g) => g.name).join(', ')
        : movie.primaryGenre?.name || 'Feature';
    return `${languages} · ${genres} · ${movie.duration} min`;
  };

  return (
    <section
      aria-labelledby="show-details-heading"
      className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6"
    >
      {/* Card Header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Clapperboard className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="show-details-heading" className="text-base font-bold text-ink">
            Show Details
          </h2>
          <p className="text-xs text-ink/60">
            Select the movie, screen and schedule
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Theatre Selector (shown when user has multiple theatres or came from global /shows/create) */}
        {!hideTheatreSelect && theatres.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="show-theatre-select"
              className="text-xs font-semibold text-ink"
            >
              Theatre <span className="text-danger-600">*</span>
            </label>
            <select
              id="show-theatre-select"
              {...register('theatreId')}
              className="min-h-[44px] w-full rounded-md border border-border bg-surface px-3.5 py-2 text-sm text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            >
              {theatres.map((theatre) => (
                <option key={theatre.id} value={theatre.id}>
                  {theatre.name} ({theatre.city.name})
                </option>
              ))}
            </select>
            {errors.theatreId && (
              <p className="text-xs text-danger-600">{errors.theatreId.message}</p>
            )}
          </div>
        )}

        {/* Movie Custom Rich Selector */}
        <div className="flex flex-col gap-1.5" ref={movieDropdownRef}>
          <label
            id="show-movie-label"
            className="text-xs font-semibold text-ink"
          >
            Movie <span className="text-danger-600">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              aria-labelledby="show-movie-label"
              aria-expanded={isMovieDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => setIsMovieDropdownOpen((prev) => !prev)}
              className={cn(
                'flex min-h-[60px] w-full items-center justify-between gap-3 rounded-md border bg-surface px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                errors.movieId ? 'border-danger-600' : 'border-border hover:border-ink/30',
              )}
            >
              {selectedMovie ? (
                <div className="flex min-w-0 items-center gap-3">
                  {selectedMovie.posterUrl ? (
                    <img
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title}
                      className="h-11 w-9 shrink-0 rounded object-cover bg-surface-muted"
                    />
                  ) : (
                    <div className="flex h-11 w-9 shrink-0 items-center justify-center rounded bg-surface-muted text-ink/50">
                      <Film className="h-4 w-4" aria-hidden="true" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">
                      {selectedMovie.title}
                    </p>
                    <p className="truncate text-xs text-ink/60">
                      {formatMovieMeta(selectedMovie)}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-ink/50">Select a movie...</span>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-ink/60 transition-transform',
                  isMovieDropdownOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            {isMovieDropdownOpen && (
              <div
                role="listbox"
                aria-labelledby="show-movie-label"
                className="absolute z-30 mt-1.5 max-h-72 w-full overflow-hidden rounded-md border border-border bg-surface shadow-float"
              >
                <div className="border-b border-border p-2">
                  <input
                    type="search"
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    placeholder="Search active movies..."
                    className="w-full rounded border border-border bg-surface-muted/50 px-3 py-1.5 text-xs text-ink focus:border-brand-600 focus:outline-none"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-border/60">
                  {filteredMovies.length === 0 ? (
                    <p className="p-4 text-center text-xs text-ink/60">
                      No matching active movies found.
                    </p>
                  ) : (
                    filteredMovies.map((movie) => {
                      const isSelected = movie.id === selectedMovie?.id;
                      return (
                        <button
                          key={movie.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setValue('movieId', movie.id, { shouldValidate: true });
                            setIsMovieDropdownOpen(false);
                          }}
                          className={cn(
                            'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-surface-muted',
                            isSelected && 'bg-brand-50/70',
                          )}
                        >
                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="h-10 w-8 shrink-0 rounded object-cover bg-surface-muted"
                            />
                          ) : (
                            <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-surface-muted text-ink/50">
                              <Film className="h-4 w-4" aria-hidden="true" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink">
                              {movie.title}
                            </p>
                            <p className="truncate text-xs text-ink/60">
                              {formatMovieMeta(movie)}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.movieId && (
            <p className="text-xs text-danger-600">{errors.movieId.message}</p>
          )}
        </div>

        {/* Screen Custom Rich Selector */}
        <div className="flex flex-col gap-1.5" ref={screenDropdownRef}>
          <label
            id="show-screen-label"
            className="text-xs font-semibold text-ink"
          >
            Screen <span className="text-danger-600">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              aria-labelledby="show-screen-label"
              aria-expanded={isScreenDropdownOpen}
              aria-haspopup="listbox"
              disabled={isLoadingScreens || screens.length === 0}
              onClick={() => setIsScreenDropdownOpen((prev) => !prev)}
              className={cn(
                'flex min-h-[60px] w-full items-center justify-between gap-3 rounded-md border bg-surface px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:cursor-not-allowed disabled:opacity-60',
                errors.screenId ? 'border-danger-600' : 'border-border hover:border-ink/30',
              )}
            >
              {selectedScreen ? (
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-bold text-ink">
                    {selectedScreen.name}
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink/70">
                    <span className="inline-flex items-center gap-1">
                      <Monitor className="h-3.5 w-3.5 text-ink/50" aria-hidden="true" />
                      {selectedScreen.totalSeats} Seats
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-ink/50" aria-hidden="true" />
                      Dolby Atmos
                    </span>
                    {(selectedScreen.cinemaFormats ?? []).map((fmt) => (
                      <span
                        key={fmt.id}
                        className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[11px] font-semibold text-ink"
                      >
                        {fmt.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-ink/50">
                  {isLoadingScreens
                    ? 'Loading screens...'
                    : 'No configured active screens found for this theatre'}
                </span>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-ink/60 transition-transform',
                  isScreenDropdownOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            {isScreenDropdownOpen && screens.length > 0 && (
              <div
                role="listbox"
                aria-labelledby="show-screen-label"
                className="absolute z-30 mt-1.5 max-h-60 w-full overflow-y-auto divide-y divide-border/60 rounded-md border border-border bg-surface shadow-float"
              >
                {screens.map((screen) => {
                  const isSelected = screen.id === selectedScreen?.id;
                  return (
                    <button
                      key={screen.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setValue('screenId', screen.id, { shouldValidate: true });
                        setIsScreenDropdownOpen(false);
                      }}
                      className={cn(
                        'flex w-full flex-col gap-1 px-3.5 py-2.5 text-left transition-colors hover:bg-surface-muted',
                        isSelected && 'bg-brand-50/70',
                      )}
                    >
                      <span className="text-sm font-semibold text-ink">
                        {screen.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/60">
                        <span>{screen.totalSeats} Seats</span>
                        {(screen.cinemaFormats ?? []).map((fmt) => (
                          <span
                            key={fmt.id}
                            className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[11px] font-semibold text-ink"
                          >
                            {fmt.name}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {errors.screenId && (
            <p className="text-xs text-danger-600">{errors.screenId.message}</p>
          )}
        </div>

        {/* Cinema Format Selector (when multiple compatible formats exist or format mismatch) */}
        {selectedMovie && selectedScreen && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">
              Projection Format <span className="text-danger-600">*</span>
            </span>
            {compatibleFormats.length === 0 ? (
              <p className="rounded-md border border-danger-600/30 bg-brand-50 px-3 py-2 text-xs text-danger-600">
                No common cinema format is supported by both {selectedMovie.title} and{' '}
                {selectedScreen.name}.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {compatibleFormats.map((fmt) => {
                  const active = cinemaFormatId === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() =>
                        setValue('cinemaFormatId', fmt.id, { shouldValidate: true })
                      }
                      className={cn(
                        'min-h-[36px] rounded-md border px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                        active
                          ? 'border-brand-600 bg-brand-50 text-brand-600'
                          : 'border-border bg-surface text-ink/70 hover:bg-surface-muted',
                      )}
                    >
                      {fmt.name}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.cinemaFormatId && (
              <p className="text-xs text-danger-600">
                {errors.cinemaFormatId.message}
              </p>
            )}
          </div>
        )}

        {/* Date, Start Time, and Auto-Calculated End Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="show-date-input"
              className="text-xs font-semibold text-ink"
            >
              Show Date <span className="text-danger-600">*</span>
            </label>
            <div className="relative flex items-center">
              <Calendar
                className="pointer-events-none absolute left-3 h-4 w-4 text-ink/50"
                aria-hidden="true"
              />
              <input
                id="show-date-input"
                type="date"
                {...register('showDate')}
                className={cn(
                  'min-h-[44px] w-full rounded-md border bg-surface pl-9 pr-3 py-2 text-sm text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20',
                  errors.showDate ? 'border-danger-600' : 'border-border',
                )}
              />
            </div>
            {errors.showDate && (
              <p className="text-xs text-danger-600">{errors.showDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="show-time-input"
              className="text-xs font-semibold text-ink"
            >
              Show Time <span className="text-danger-600">*</span>
            </label>
            <div className="relative flex items-center">
              <Clock
                className="pointer-events-none absolute left-3 h-4 w-4 text-ink/50"
                aria-hidden="true"
              />
              <input
                id="show-time-input"
                type="time"
                {...register('showTime')}
                className={cn(
                  'min-h-[44px] w-full rounded-md border bg-surface pl-9 pr-3 py-2 text-sm text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20',
                  errors.showTime ? 'border-danger-600' : 'border-border',
                )}
              />
            </div>
            {errors.showTime && (
              <p className="text-xs text-danger-600">{errors.showTime.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
              End Time
              <span title="Automatically calculated from show start time and movie duration">
                <Info className="h-3.5 w-3.5 text-ink/50" aria-hidden="true" />
              </span>
            </span>
            <div
              aria-label="Calculated end time"
              className="flex min-h-[44px] items-center gap-2 rounded-md border border-border bg-surface-muted/80 px-3 py-2 text-sm font-medium text-ink/70"
            >
              <Clock className="h-4 w-4 shrink-0 text-ink/50" aria-hidden="true" />
              <span>{formatShowTime12h(endTimeDate)}</span>
            </div>
          </div>
        </div>

        {/* Scheduling Information Banner */}
        <ShowSchedulingInfoBanner
          evaluation={scheduleEvaluation}
          isChecking={isCheckingSchedule}
          hasScreenAndTiming={Boolean(
            selectedScreen && selectedMovie && showDate && showTime,
          )}
        />
      </div>
    </section>
  );
}

