import { useState } from 'react';
import { useFieldArray, type FieldErrors } from 'react-hook-form';
import PersonSelector from '../person/PersonSelector';
import type { Person } from '../person.types';

interface MovieCrewProps {
  control: any;
  register: any;
  errors?: FieldErrors<any> | any;
}

export default function MovieCrew({ control, register, errors }: MovieCrewProps) {
  const { fields, append, remove } = useFieldArray<{ crew: { personId: string; job: string }[] }>({
    control,
    name: 'crew',
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
      job: 'Director',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const crewErrorMessage =
    typeof (errors?.crew as any)?.message === 'string'
      ? (errors?.crew as any).message
      : null;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm" id="crew-section">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Movie Crew &amp; Technicians</h2>
          <p className="text-xs text-slate-500">Add directors, producers, music composers, writers, and cinematographers.</p>
        </div>
      </div>

      <div className="mb-4">
        <PersonSelector onSelect={handlePersonSelect} placeholder="Search director or crew (e.g. Lokesh Kanagaraj, Jithu Joseph)..." />
      </div>

      {crewErrorMessage && (
        <p className="my-3 text-xs font-semibold text-rose-600">
          ⚠️ {crewErrorMessage}
        </p>
      )}

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field, index) => {
            const person = selectedPeople.find((p) => p.id === field.personId);

            return (
              <div key={field.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <input type="hidden" {...register(`crew.${index}.personId`)} />

                {person?.imageUrl ? (
                  <img src={person.imageUrl} alt={person.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                    {person?.name ? person.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="block truncate text-xs font-bold text-slate-900">{person?.name || 'Crew Member'}</span>
                  <input
                    type="text"
                    className="mt-1 h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
                    placeholder="Job Role (e.g. Director, Music)"
                    {...register(`crew.${index}.job`)}
                  />
                </div>

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  onClick={() => handleRemove(index)}
                  title="Remove crew member"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          🎬 No crew members added yet. Search and select crew members above to add them.
        </div>
      )}
    </section>
  );
}
