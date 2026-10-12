import { useState } from 'react';
import { useFieldArray, useFormContext, type FieldErrors, type Control, type UseFormRegister } from 'react-hook-form';
import PersonSelector from './PersonSelector';
import type { Person } from '../types/person.types';
import { usePersons } from '../hooks/usePerson';
import FormSection from './FormSection';

interface MovieCastProps {
  control?: Control<any>;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
}

export default function MovieCast(props: MovieCastProps = {}) {
  const context = useFormContext();
  const control = props.control ?? context?.control;
  const register = props.register ?? context?.register;
  const errors = props.errors ?? context?.formState?.errors ?? {};

  const { fields, append, remove } = useFieldArray<any>({
    control: control as any,
    name: 'cast',
  });

  const castFields = fields as Array<{ id: string; personId: string; character?: string }>;

  const { data: persons = [] } = usePersons();
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);

  const handlePersonSelect = (person: Person) => {
    const alreadySelected = castFields.some((field) => field.personId === person.id);
    if (alreadySelected) return;

    setSelectedPeople((current) => {
      const exists = current.some((item) => item.id === person.id);
      return exists ? current : [...current, person];
    });

    append({
      personId: person.id,
      character: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const castErrorMessage =
    typeof (errors?.cast as any)?.message === 'string'
      ? (errors?.cast as any).message
      : null;

  return (
    <FormSection
      id="cast-section"
      title="Movie Cast"
      description="Add lead actors, supporting cast, and their respective character names."
      icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      }
    >
      <div className="mb-4">
        <PersonSelector onSelect={handlePersonSelect} placeholder="Search actor name (e.g. Mohanlal, Mammootty)..." />
      </div>

      {castErrorMessage && (
        <p className="my-3 text-xs font-semibold text-danger-600">
          ⚠️ {castErrorMessage}
        </p>
      )}

      {castFields.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {castFields.map((field, index) => {
            const person =
              selectedPeople.find((p) => p.id === field.personId) ||
              persons.find((p) => p.id === field.personId);

            return (
              <div key={field.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-3">
                {register && <input type="hidden" {...register(`cast.${index}.personId`)} />}

                {person?.imageUrl ? (
                  <img src={person.imageUrl} alt={person.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                    {person?.name ? person.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="block truncate text-xs font-bold text-ink">{person?.name || 'Actor'}</span>
                  {register && (
                    <input
                      type="text"
                      className="mt-1 h-10 w-full rounded-md border border-border bg-surface px-2.5 text-base md:text-xs text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                      placeholder="Character Name (e.g. Ranga)"
                      {...register(`cast.${index}.character`)}
                    />
                  )}
                </div>

                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-600/10 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  onClick={() => handleRemove(index)}
                  title="Remove cast member"
                  aria-label="Remove cast member"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-xs text-ink-muted">
          🎭 No cast members added yet. Search and select actors above to feature them.
        </div>
      )}
    </FormSection>
  );
}