import { useState, useEffect } from 'react';
// import { useCreatePerson } from '../../../../../../hooks/usePerson';
import { useCreatePerson } from '../../../hooks/usePerson';
import type { Person } from '../person.types';
// import styles from "./CreatePersonModal.module.css"
interface CreatePersonModalProps {
  initialName: string;
  onClose: () => void;
  onCreated: (person: Person) => void;
}

export default function CreatePersonModal({
  initialName,
  onClose,
  onCreated,
}: CreatePersonModalProps) {
  const [name, setName] = useState(initialName?.trim() ?? '');
  const [image, setImage] = useState<File | null>(null);
  const createPerson = useCreatePerson();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      const person = await createPerson.mutateAsync({
        name: trimmedName,
        image: image ?? undefined,
      });
      onCreated(person);
    } catch (error) {
      console.error('Failed to create person:', error);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            Create New Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="person-name" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Full Name
            </label>
            <input
              id="person-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (createPerson.isError) createPerson.reset();
              }}
              placeholder="Enter actor/director name"
              autoFocus
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label htmlFor="person-image" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Profile Image (Optional)
            </label>
            <input
              id="person-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                setImage(event.target.files?.[0] ?? null);
                if (createPerson.isError) createPerson.reset();
              }}
              style={{
                width: '100%',
                fontSize: '0.88rem',
                color: '#475569',
              }}
            />
          </div>

          {createPerson.isError && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#dc2626', fontWeight: 500 }}>
              ⚠️ Failed to create profile. Please try again.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={createPerson.isPending}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createPerson.isPending || !name.trim()}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: createPerson.isPending || !name.trim() ? '#94a3b8' : '#f84464',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: createPerson.isPending || !name.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {createPerson.isPending ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
