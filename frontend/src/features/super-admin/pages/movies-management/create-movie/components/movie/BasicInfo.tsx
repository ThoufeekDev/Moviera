import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import Input from '../../../../../../../shared/components/Input/Input';
import styles from './BasicInfo.module.css';

import { Certification } from '../../../../../../../shared/constants/Certification';
import { useGenres } from '../../../hooks/useGenre';

interface MovieBasicInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const certificates = [
  {
    code: Certification.U,
    label: 'U (Universal)',
  },
  {
    code: Certification.UA,
    label: 'U/A',
  },
  {
    code: Certification.A,
    label: 'A (Adults Only)',
  },
  {
    code: Certification.S,
    label: 'S (Special Class)',
  },
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
  const {
    data: genres = [],
    isLoading: genresLoading,
    isError: genresError,
  } = useGenres();

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
    <section className={styles.sectionCard} id="basic-info-section">
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
        </div>
        <div className={styles.headerText}>
          <h2>Basic Information</h2>
          <p>Enter the core cinematic details of the movie.</p>
        </div>
      </div>

      <div className={styles.formGrid}>
        {/* Title */}
        <div className={styles.fullWidth}>
          <Input
            id="movie-title"
            label="Movie Title"
            placeholder="e.g. Kalki 2898 AD / Pushpa 2: The Rule"
            {...register('title')}
            error={errors.title?.message}
          />
        </div>

        {/* Description */}
        <div className={`${styles.fullWidth} ${styles.fieldGroup}`}>
          <div className={styles.fieldLabel}>
            <label htmlFor="movie-description">Synopsis / Description</label>
            <span className={styles.helperText}>
              {descriptionVal ? `${descriptionVal.length} / 2000` : 'Min 10 characters'}
            </span>
          </div>

          <textarea
            id="movie-description"
            className={styles.textarea}
            placeholder="Write a captivating synopsis summarizing the storyline..."
            {...register('description')}
          />

          {descErr && (
            <p className={styles.errorMsg}>{descErr}</p>
          )}
        </div>

        {/* Duration */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>
            <span>Duration (Minutes)</span>
            {Boolean(formattedDuration) && (
              <span className={styles.helperText}>⏱ {formattedDuration}</span>
            )}
          </div>
          <Input
            id="movie-duration"
            type="number"
            placeholder="e.g. 150"
            {...register('duration', {
              valueAsNumber: true,
            })}
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

        {/* Genre */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            Primary Genre
          </label>

          {genresLoading && (
            <p className={styles.helperText}>Loading genres...</p>
          )}

          {genresError && (
            <p className={styles.errorMsg}>
              Failed to load genres
            </p>
          )}

          {!genresLoading && !genresError && (
            <div className={styles.certPillGroup}>
              {genres.map((genre) => {
                const isSelected = watch('primaryGenreId') === genre.id;

                return (
                  <button
                    type="button"
                    key={genre.id}
                    className={`${styles.certPill} ${
                      isSelected ? styles.certPillActive : ''
                    }`}
                    onClick={() => {
                      setValue('primaryGenreId', genre.id, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          )}

          {genreErr && (
            <p className={styles.errorMsg}>
              {genreErr}
            </p>
          )}
        </div>

        {/* Certificate selection */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Certification Rating</label>

          {/* Hidden input for form registration */}
          <input type="hidden" {...register('certificate')} />

          <div className={styles.certPillGroup}>
            {certificates.map((cert) => {
              const isSelected = certificateVal === cert.code;
              return (
                <button
                  type="button"
                  key={cert.code}
                  className={`${styles.certPill} ${isSelected ? styles.certPillActive : ''}`}
                  onClick={() => {
                    setValue('certificate', cert.code, { shouldValidate: true });
                  }}
                >
                  {cert.code}
                </button>
              );
            })}
          </div>

          {certErr && (
            <p className={styles.errorMsg}>{certErr}</p>
          )}
        </div>
      </div>
    </section>
  );
}