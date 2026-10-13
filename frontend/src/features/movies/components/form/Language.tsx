import { Controller, useFormContext, type FieldErrors, type Control } from 'react-hook-form';
import { useLanguages } from '../../hooks/useLanguages';
import { useCinemaFormats } from '../../hooks/useCinemaFormats';
import { FormSection } from '@/shared/ui/FormSection';
import { ChipSelect } from '@/shared/ui/ChipSelect';

interface MovieLanguagesProps {
  control?: Control<any>;
  errors?: FieldErrors<any>;
}

export default function MovieLanguages(props: MovieLanguagesProps = {}) {
  const context = useFormContext();
  const control = props.control ?? context?.control;
  const errors = props.errors ?? context?.formState?.errors ?? {};

  const { data: languages = [] } = useLanguages();
  const { data: cinemaFormats = [] } = useCinemaFormats();

  const getErrorString = (err?: any): string | null => {
    if (!err) return null;
    if (typeof err.message === 'string') return err.message;
    return null;
  };

  const langErr = getErrorString(errors?.languages);
  const formatErr = getErrorString(errors?.cinemaFormatIds);

  const cinemaFormatOptions = cinemaFormats.map((f) => ({
    value: f.id,
    label: f.name,
  }));

  return (
    <FormSection
      id="languages-section"
      title="Languages & Formats"
      description="Select audio languages and viewing formats supported for ticket bookings."
      icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      }
    >
      <div className="mb-3 text-sm font-semibold text-ink">
        🌐 Audio Languages
      </div>

      {control && (
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
      )}

      {langErr && <p className="mt-2 text-xs font-medium text-danger-600">⚠️ {langErr}</p>}

      {/* Screen Formats */}
      <div className="mt-8 border-t border-border pt-6">
        <div className="mb-3 text-sm font-semibold text-ink">
          🎬 Cinema Formats
        </div>

        {control && (
          <Controller
            name="cinemaFormatIds"
            control={control}
            render={({ field }) => (
              <ChipSelect
                options={cinemaFormatOptions}
                value={field.value ?? []}
                multiple
                activeVariant="solid"
                error={formatErr}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </div>
    </FormSection>
  );
}