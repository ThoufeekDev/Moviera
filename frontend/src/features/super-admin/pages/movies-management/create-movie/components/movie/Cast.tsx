import { useState } from 'react';
import { useFieldArray, type FieldErrors } from 'react-hook-form';
import PersonSelector from '../person/PersonSelector';
import type { Person } from '../person.types';

interface MovieCastProps {
  control: any;
  register: any;
  errors?: FieldErrors<any> | any;
}

export default function MovieCast({ control, register, errors }: MovieCastProps) {
  const { fields, append, remove } = useFieldArray<{ cast: { personId: string; character?: string }[] }>({
    control,
    name: 'cast',
  });

  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);

  const handlePersonSelect = (person: Person) => {
    const alreadySelected = fields.some((field) => field.personId === person.id);
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
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm" id="cast-section">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Movie Cast</h2>
          <p className="text-xs text-slate-500">Add lead actors, supporting cast, and their respective character names.</p>
        </div>
      </div>

      <div className="mb-4">
        <PersonSelector onSelect={handlePersonSelect} placeholder="Search actor name (e.g. Mohanlal, Mammootty)..." />
      </div>

      {castErrorMessage && (
        <p className="my-3 text-xs font-semibold text-rose-600">
          ⚠️ {castErrorMessage}
        </p>
      )}

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field, index) => {
            const person = selectedPeople.find((p) => p.id === field.personId);

            return (
              <div key={field.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <input type="hidden" {...register(`cast.${index}.personId`)} />

                {person?.imageUrl ? (
                  <img src={person.imageUrl} alt={person.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                    {person?.name ? person.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="block truncate text-xs font-bold text-slate-900">{person?.name || 'Actor'}</span>
                  <input
                    type="text"
                    className="mt-1 h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
                    placeholder="Character Name (e.g. Ranga)"
                    {...register(`cast.${index}.character`)}
                  />
                </div>

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  onClick={() => handleRemove(index)}
                  title="Remove cast member"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          🎭 No cast members added yet. Search and select actors above to feature them.
        </div>
      )}
    </section>
  );
}