import { useState } from 'react';
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { CreateMovieFormInput } from '../../../../../validators/createMovie.schema';
import PersonSelector from '../person/PersonSelector';
import type { Person } from '../person.type';
import styles from './movieCast.module.css';

interface MovieCastProps {
  control: Control<CreateMovieFormInput>;
  register: UseFormRegister<CreateMovieFormInput>;
  errors?: FieldErrors<CreateMovieFormInput>;
}

export default function MovieCast({ control, register, errors }: MovieCastProps) {
  const { fields, append, remove } = useFieldArray({
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

  return (
    <section className={styles.sectionCard} id="cast-section">
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className={styles.headerText}>
          <h2>Movie Cast</h2>
          <p>Add lead actors, supporting cast, and their respective character names.</p>
        </div>
      </div>

      <div className={styles.selectorWrapper}>
        <PersonSelector onSelect={handlePersonSelect} placeholder="Search actor name (e.g. Mohanlal, Mammootty)..." />
      </div>

      {errors?.cast?.message && (
        <p className={styles.errorMsg} style={{ marginTop: '0.75rem', marginBottom: '0.75rem', color: '#dc2626' }}>
          ⚠️ {errors.cast.message}
        </p>
      )}

      {fields.length > 0 ? (
        <div className={styles.castGrid}>
          {fields.map((field, index) => {
            const person = selectedPeople.find((p) => p.id === field.personId);

            return (
              <div key={field.id} className={styles.castCard}>
                <input type="hidden" {...register(`cast.${index}.personId`)} />

                {person?.imageUrl ? (
                  <img src={person.imageUrl} alt={person.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {person?.name ? person.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}

                <div className={styles.cardInfo}>
                  <span className={styles.personName}>{person?.name || 'Actor'}</span>
                  <input
                    type="text"
                    className={styles.characterInput}
                    placeholder="Character Name (e.g. Ranga)"
                    {...register(`cast.${index}.character`)}
                  />
                </div>

                <button
                  type="button"
                  className={styles.removeBtn}
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
        <div className={styles.emptyState}>
          🎭 No cast members added yet. Search and select actors above to feature them.
        </div>
      )}
    </section>
  );
}