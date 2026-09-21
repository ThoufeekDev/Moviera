import { Controller,type FieldErrors } from 'react-hook-form';
import styles from "./Language.module.css"

import { useLanguages } from '../../../hooks/useLanguage';
import { useCinemaFormats } from '../../../hooks/useCinemaFormats';


interface MovieLanguagesProps {
  control: any;
  errors?: FieldErrors<any> | any;
}

export default function MovieLanguages({ control, errors }: MovieLanguagesProps) {
  const { data: languages = [] } = useLanguages()
  const { data: cinemaFormats = [] } = useCinemaFormats();

  const getErrorString = (err?: any): string | null => {
    if (!err) return null;
    if (typeof err.message === 'string') return err.message;
    return null;
  };

  const langErr = getErrorString(errors?.languages);
  const formatErr = getErrorString(errors?.cinemaFormatIds);

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
                      const current: string[] = field.value ?? [];
                      if (event.target.checked) {
                        field.onChange([...current, language.id]);
                      } else {
                        field.onChange(current.filter((id: string) => id !== language.id));
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

      {langErr && (
        <p className={styles.errorMsg}>⚠️ {langErr}</p>
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
                        const current: string[] = field.value ?? [];

                        if (checked) {
                          field.onChange(
                            current.filter((id: string) => id !== format.id)
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

          {formatErr && (
            <p className={styles.errorMsg}>
              ⚠️ {formatErr}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}