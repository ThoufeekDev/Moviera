import { useState } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import type { CreateMovieFormInput } from '../../../../../validators/createMovie.schema';
import styles from './MovieLangugage.module.css';


import { useLanguages } from '../../../../../hooks/useLanguage';
import { useCinemaFormats } from '../../../../../hooks/useCinemaFormats';

const availableFormats = ['2D', '3D', 'IMAX 3D', '4DX', 'ScreenX', 'Dolby Atmos'];

interface MovieLanguagesProps {
  control: Control<CreateMovieFormInput>;
  errors: FieldErrors<CreateMovieFormInput>;
}

export default function MovieLanguages({ control, errors }: MovieLanguagesProps) {
  const { data: languages = [], isLoading, isError } = useLanguages()
  const { data: cinemaFormats = [], isLoading:formatsLoading, isError:formatsError } = useCinemaFormats();
  // const [selectedFormats, setSelectedFormats] = useState<string[]>(['2D', 'Dolby Atmos']);

  // const toggleFormat = (fmt: string) => {
  //   setSelectedFormats((prev) =>
  //     prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt],
  //   );
  // };

  return (
    <section className={styles.sectionCard} id="languages-section">
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div className={styles.headerText}>
          <h2>Languages & Formats</h2>
          <p>Select audio languages and viewing formats supported for ticket bookings.</p>
        </div>
      </div>

      <div className={styles.groupTitle}>
        🌐 Audio Languages
      </div>

      <Controller
        name="languages"
        control={control}
        render={({ field }) => (
          <div className={styles.chipGrid}>
            {languages.map((language) => {
              const checked = field.value?.includes(language.id);

              return (
                <label
                  key={language.id}
                  className={`${styles.languageChip} ${checked ? styles.languageChipActive : ''}`}
                >
                  <input
                    type="checkbox"
                    className={styles.hiddenCheckbox}
                    checked={checked || false}
                    onChange={(event) => {
                      const current = field.value ?? [];
                      if (event.target.checked) {
                        field.onChange([...current, language.id]);
                      } else {
                        field.onChange(current.filter((id) => id !== language.id));
                      }
                    }}
                  />

                  {checked && (
                    <span className={styles.checkmark}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                  <span>{language.name}</span>
                </label>
              );
            })}
          </div>
        )}
      />

      {errors.languages && (
        <p className={styles.errorMsg}>⚠️ {errors.languages.message}</p>
      )}

      {/* Screen Formats */}
      <div className={styles.formatGroup}>
        <div className={styles.groupTitle}>
          🎬 Cinema Formats
        </div>
        <div className={styles.formatGrid}>
        <Controller
  name="cinemaFormatIds"
  control={control}
  render={({ field }) => (
    <div className={styles.formatGrid}>
      {cinemaFormats.map((format) => {
        const checked = field.value?.includes(format.id);

        return (
          <button
            type="button"
            key={format.id}
            className={`${styles.formatTag} ${
              checked ? styles.formatTagActive : ''
            }`}
            onClick={() => {
              const current = field.value ?? [];

              if (checked) {
                field.onChange(
                  current.filter((id) => id !== format.id)
                );
              } else {
                field.onChange([...current, format.id]);
              }
            }}
          >
            {format.name} {checked ? '✓' : '+'}
          </button>
        );
      })}
    </div>
  )}
          />
          
          {errors.cinemaFormatIds && (
  <p className={styles.errorMsg}>
    ⚠️ {errors.cinemaFormatIds.message}
  </p>
)}
        </div>
      </div>
    </section>
  );
}