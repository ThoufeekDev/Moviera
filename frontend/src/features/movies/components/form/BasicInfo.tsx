import { useFormContext, type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { Certification } from '@/shared/constants/Certification';
import { useGenres } from '../../hooks/useGenres';
import { FormSection } from '@/shared/ui/FormSection';
import { ChipSelect } from '@/shared/ui/ChipSelect';

interface MovieBasicInfoProps {
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
}

const certificates = [
  { value: Certification.U, label: 'U (Universal)' },
  { value: Certification.UA, label: 'U/A' },
  { value: Certification.A, label: 'A (Adults Only)' },
  { value: Certification.S, label: 'S (Special Class)' },
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

export default function MovieBasicInfo(props: MovieBasicInfoProps = {}) {
  const context = useFormContext();
  const register = props.register ?? context?.register;
  const errors = props.errors ?? context?.formState?.errors ?? {};
  const setValue = props.setValue ?? context?.setValue;
  const watch = props.watch ?? context?.watch;

  const getWatch = (field: string) => (watch ? (watch as any)(field) : undefined);

  const { data: genres = [], isLoading: genresLoading, isError: genresError } = useGenres();

  const descriptionVal = getWatch('description') || '';
  const durationVal = getWatch('duration');
  const formattedDuration = formatDuration(durationVal);
  const certificateVal = getWatch('certificate');

  const getErrorString = (err?: any): string | null => {
    if (!err) return null;
    if (typeof err.message === 'string') return err.message;
    return null;
  };

  const descErr = getErrorString(errors.description);
  const genreErr = getErrorString(errors.primaryGenreId);
  const certErr = getErrorString(errors.certificate);

  const genreOptions = genres.map((g) => ({ value: g.id, label: g.name }));

  return (
    <FormSection
      id="basic-info-section"
      title="Basic Information"
      description="Enter the core cinematic details of the movie."
      icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <Input
            id="movie-title"
            label="Movie Title"
            placeholder="e.g. Kalki 2898 AD / Pushpa 2: The Rule"
            {...(register ? register('title') : {})}
            error={errors.title?.message as string}
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="movie-description" className="font-semibold text-ink">
              Synopsis / Description
            </label>
            <span className="text-ink-muted">
              {descriptionVal ? `${descriptionVal.length} / 2000` : 'Min 10 characters'}
            </span>
          </div>

          <textarea
            id="movie-description"
            rows={4}
            className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-base md:text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            placeholder="Write a captivating synopsis summarizing the storyline..."
            {...(register ? register('description') : {})}
          />

          {descErr && <p className="text-xs font-medium text-danger-600">{descErr}</p>}
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink">
            <span>Duration (Minutes)</span>
            {Boolean(formattedDuration) && (
              <span className="text-ink-muted">⏱ {formattedDuration}</span>
            )}
          </div>
          <Input
            id="movie-duration"
            type="number"
            placeholder="e.g. 150"
            {...(register ? register('duration', { valueAsNumber: true }) : {})}
            error={errors.duration?.message as string}
          />
        </div>

        {/* Release Date */}
        <div>
          <Input
            id="movie-release-date"
            type="date"
            label="Release Date"
            {...(register ? register('releaseDate') : {})}
            error={errors.releaseDate?.message as string}
          />
        </div>

        {/* Genres */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-semibold text-ink">Genres</label>
          <p className="text-xs text-ink-muted">Select all genres that apply to this movie.</p>

          {genresLoading && <p className="text-xs text-ink-muted">Loading genres...</p>}
          {genresError && <p className="text-xs font-medium text-danger-600">Failed to load genres</p>}

          {!genresLoading && !genresError && (
            <ChipSelect
              options={genreOptions}
              value={getWatch('genreIds') || []}
              multiple
              activeVariant="subtle"
              error={getErrorString(errors.genreIds)}
              onChange={(nextGenreIds: string[]) => {
                if (setValue) {
                  setValue('genreIds', nextGenreIds, { shouldValidate: true });
                  const primaryGenreId = getWatch('primaryGenreId') || '';
                  if (!nextGenreIds.includes(primaryGenreId)) {
                    setValue('primaryGenreId', '', { shouldValidate: true });
                  }
                }
              }}
            />
          )}
        </div>

        {/* Primary Genre */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-semibold text-ink">Primary Genre</label>
          <p className="text-xs text-ink-muted">Choose the main genre of this movie.</p>

          {!genresLoading && !genresError && (
            <ChipSelect
              options={genreOptions}
              value={getWatch('primaryGenreId') || ''}
              activeVariant="solid"
              error={genreErr}
              onChange={(selectedId: string) => {
                if (setValue) {
                  const currentGenreIds = getWatch('genreIds') || [];
                  setValue('primaryGenreId', selectedId, { shouldValidate: true });
                  if (!currentGenreIds.includes(selectedId)) {
                    setValue('genreIds', [...currentGenreIds, selectedId], {
                      shouldValidate: true,
                    });
                  }
                }
              }}
            />
          )}
        </div>

        {/* Certificate selection */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-semibold text-ink">Certification Rating</label>
          {register && <input type="hidden" {...register('certificate')} />}

          <ChipSelect
            options={certificates}
            value={certificateVal}
            shape="square"
            activeVariant="solid"
            error={certErr}
            onChange={(selectedCert: string) => {
              if (setValue) {
                setValue('certificate', selectedCert, { shouldValidate: true });
              }
            }}
          />
        </div>
      </div>
    </FormSection>
  );
}