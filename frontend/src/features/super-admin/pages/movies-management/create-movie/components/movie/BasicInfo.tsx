import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { Certification } from '@/shared/constants/Certification';
import { useGenres } from '../../../hooks/useGenre';

interface MovieBasicInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const certificates = [
  { code: Certification.U, label: 'U (Universal)' },
  { code: Certification.UA, label: 'U/A' },
  { code: Certification.A, label: 'A (Adults Only)' },
  { code: Certification.S, label: 'S (Special Class)' },
];

const formatDuration = (mins?: unknown) => {
  const num = Number(mins);
  if (!num || isNaN(num) || num <= 0) return null;
  const h = Math.floor(num / 60);
  const m = num % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export default function MovieBasicInfo({
  register,
  errors,
  setValue,
  watch,
}: MovieBasicInfoProps) {
  const { data: genres = [], isLoading: genresLoading, isError: genresError } = useGenres();

  const descriptionVal = watch ? watch('description') : '';
  const durationVal = watch ? watch('duration') : undefined;
  const formattedDuration = formatDuration(durationVal);
  const certificateVal = watch ? watch('certificate') : undefined;

  const getErrorString = (err?: any): string | null => {
    if (!err) return null;
    if (typeof err.message === 'string') return err.message;
    return null;
  };

  const descErr = getErrorString(errors.description);
  const genreErr = getErrorString(errors.primaryGenreId);
  const certErr = getErrorString(errors.certificate);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm" id="basic-info-section">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
          <p className="text-xs text-slate-500">Enter the core cinematic details of the movie.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <Input
            id="movie-title"
            label="Movie Title"
            placeholder="e.g. Kalki 2898 AD / Pushpa 2: The Rule"
            {...register('title')}
            error={errors.title?.message}
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="movie-description" className="font-semibold text-slate-700">
              Synopsis / Description
            </label>
            <span className="text-slate-400">
              {descriptionVal ? `${descriptionVal.length} / 2000` : 'Min 10 characters'}
            </span>
          </div>

          <textarea
            id="movie-description"
            rows={4}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="Write a captivating synopsis summarizing the storyline..."
            {...register('description')}
          />

          {descErr && <p className="text-xs text-rose-500">{descErr}</p>}
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Duration (Minutes)</span>
            {Boolean(formattedDuration) && (
              <span className="text-slate-500">⏱ {formattedDuration}</span>
            )}
          </div>
          <Input
            id="movie-duration"
            type="number"
            placeholder="e.g. 150"
            {...register('duration', { valueAsNumber: true })}
            error={errors.duration?.message}
          />
        </div>

        {/* Release Date */}
        <div>
          <Input
            id="movie-release-date"
            type="date"
            label="Release Date"
            {...register('releaseDate')}
            error={errors.releaseDate?.message}
          />
        </div>

        {/* Genres */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700">Genres</label>
          <p className="text-xs text-slate-400">Select all genres that apply to this movie.</p>

          {genresLoading && <p className="text-xs text-slate-400">Loading genres...</p>}
          {genresError && <p className="text-xs text-rose-500">Failed to load genres</p>}

          {!genresLoading && !genresError && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const selectedGenreIds = watch('genreIds') || [];
                const isSelected = selectedGenreIds.includes(genre.id);

                return (
                  <button
                    type="button"
                    key={genre.id}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'border border-brand-500 bg-brand-50 text-brand-600'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                    onClick={() => {
                      const currentGenreIds = watch('genreIds') || [];
                      if (currentGenreIds.includes(genre.id)) {
                        setValue(
                          'genreIds',
                          currentGenreIds.filter((id: string) => id !== genre.id),
                          { shouldValidate: true }
                        );
                      } else {
                        setValue('genreIds', [...currentGenreIds, genre.id], {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          )}

          {getErrorString(errors.genreIds) && (
            <p className="text-xs text-rose-500">{getErrorString(errors.genreIds)}</p>
          )}
        </div>

        {/* Primary Genre */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700">Primary Genre</label>
          <p className="text-xs text-slate-400">Choose the main genre of this movie.</p>

          {!genresLoading && !genresError && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const primaryGenreId = watch('primaryGenreId');
                const isSelected = primaryGenreId === genre.id;

                return (
                  <button
                    type="button"
                    key={genre.id}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'border border-brand-500 bg-brand-500 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                    onClick={() => {
                      const currentGenreIds = watch('genreIds') || [];
                      setValue('primaryGenreId', genre.id, { shouldValidate: true });
                      if (!currentGenreIds.includes(genre.id)) {
                        setValue('genreIds', [...currentGenreIds, genre.id], {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          )}

          {genreErr && <p className="text-xs text-rose-500">{genreErr}</p>}
        </div>

        {/* Certificate selection */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700">Certification Rating</label>
          <input type="hidden" {...register('certificate')} />

          <div className="flex flex-wrap gap-2">
            {certificates.map((cert) => {
              const isSelected = certificateVal === cert.code;
              return (
                <button
                  type="button"
                  key={cert.code}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    isSelected
                      ? 'border border-brand-500 bg-brand-500 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setValue('certificate', cert.code, { shouldValidate: true });
                  }}
                >
                  {cert.code}
                </button>
              );
            })}
          </div>

          {certErr && <p className="text-xs text-rose-500">{certErr}</p>}
        </div>
      </div>
    </section>
  );
}