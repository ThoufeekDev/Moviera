import { Controller, type FieldErrors } from 'react-hook-form';
import { useLanguages } from '../hooks/useLanguage';
import { useCinemaFormats } from '../hooks/useCinemaFormats';

interface MovieLanguagesProps {
  control: any;
  errors?: FieldErrors<any> | any;
}

export default function MovieLanguages({ control, errors }: MovieLanguagesProps) {
  const { data: languages = [] } = useLanguages();
  const { data: cinemaFormats = [] } = useCinemaFormats();

  const getErrorString = (err?: any): string | null => {
    if (!err) return null;
    if (typeof err.message === 'string') return err.message;
    return null;
  };

  const langErr = getErrorString(errors?.languages);
  const formatErr = getErrorString(errors?.cinemaFormatIds);

  return (
    <section className="rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card" id="languages-section">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md border border-brand-500/20 bg-brand-50 text-brand-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">Languages &amp; Formats</h2>
          <p className="text-xs text-ink-muted">Select audio languages and viewing formats supported for ticket bookings.</p>
        </div>
      </div>

      <div className="mb-3 text-sm font-semibold text-ink">
        🌐 Audio Languages
      </div>

      <Controller
        name="languages"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((language) => {
              const checked = field.value?.includes(language.id);

              return (
                <label
                  key={language.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-md border p-3 text-sm font-medium transition-colors ${
                    checked
                      ? 'border-brand-600 bg-brand-50 text-brand-600'
                      : 'border-border bg-surface text-ink hover:border-brand-600/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-brand-600 accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
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
                  <span>{language.name}</span>
                </label>
              );
            })}
          </div>
        )}
      />

      {langErr && <p className="mt-2 text-xs font-medium text-danger-600">⚠️ {langErr}</p>}

      {/* Screen Formats */}
      <div className="mt-8 border-t border-border pt-6">
        <div className="mb-3 text-sm font-semibold text-ink">
          🎬 Cinema Formats
        </div>

        <Controller
          name="cinemaFormatIds"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2.5">
              {cinemaFormats.map((format) => {
                const checked = field.value?.includes(format.id);

                return (
                  <button
                    type="button"
                    key={format.id}
                    className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                      checked
                        ? 'border border-brand-600 bg-brand-600 text-white shadow-card'
                        : 'border border-border bg-surface text-ink hover:border-brand-600/40'
                    }`}
                    onClick={() => {
                      const current: string[] = field.value ?? [];
                      if (checked) {
                        field.onChange(current.filter((id: string) => id !== format.id));
                      } else {
                        field.onChange(current.filter((id: string) => id !== format.id));
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

        {formatErr && <p className="mt-2 text-xs font-medium text-danger-600">⚠️ {formatErr}</p>}
      </div>
    </section>
  );
}