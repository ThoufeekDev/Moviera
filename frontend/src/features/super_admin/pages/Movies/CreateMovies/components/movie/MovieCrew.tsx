import { useState } from 'react';
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { CreateMovieFormInput } from '../../../../../validators/createMovie.schema';
import PersonSelector from '../person/PersonSelector';
import type { Person } from '../person.type';
import styles from './MovieCrew.module.css';

interface MovieCrewProps {
  control: Control<CreateMovieFormInput>;
  register: UseFormRegister<CreateMovieFormInput>;
  errors?: FieldErrors<CreateMovieFormInput>;
}

export default function MovieCrew({ control, register, errors }: MovieCrewProps) {
  const { fields, append, remove } = useFieldArray({
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

  return (
    <section className={styles.sectionCard} id="crew-section">
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
        <div className={styles.headerText}>
          <h2>Movie Crew & Technicians</h2>
          <p>Add directors, producers, music composers, writers, and cinematographers.</p>
        </div>
      </div>

      <div className={styles.selectorWrapper}>
        <PersonSelector onSelect={handlePersonSelect} placeholder="Search director or crew (e.g. Lokesh Kanagaraj, Jithu Joseph)..." />
      </div>

      {errors?.crew?.message && (
        <p className={styles.errorMsg} style={{ marginTop: '0.75rem', marginBottom: '0.75rem', color: '#dc2626' }}>
          ⚠️ {errors.crew.message}
        </p>
      )}

      {fields.length > 0 ? (
        <div className={styles.crewGrid}>
          {fields.map((field, index) => {
            const person = selectedPeople.find((p) => p.id === field.personId);

            return (
              <div key={field.id} className={styles.crewCard}>
                <input type="hidden" {...register(`crew.${index}.personId`)} />

                {person?.imageUrl ? (
                  <img src={person.imageUrl} alt={person.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {person?.name ? person.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}

                <div className={styles.cardInfo}>
                  <span className={styles.personName}>{person?.name || 'Crew Member'}</span>
                  <input
                    type="text"
                    className={styles.jobInput}
                    placeholder="Job Role (e.g. Director, Music)"
                    {...register(`crew.${index}.job`)}
                  />
                </div>

                <button
                  type="button"
                  className={styles.removeBtn}
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
        <div className={styles.emptyState}>
          🎬 No crew members added yet. Search and select crew members above to add them.
        </div>
      )}
    </section>
  );
}
