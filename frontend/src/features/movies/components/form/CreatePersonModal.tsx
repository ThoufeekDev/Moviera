import { useState, useEffect } from 'react';
import { useCreatePerson } from '../../hooks/usePersons';
import type { Person } from '../../types/person.types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

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
    <Modal isOpen={true} onClose={onClose} title="Create New Profile">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        <Input
          id="person-name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (createPerson.isError) createPerson.reset();
          }}
          placeholder="Enter actor/director name"
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="person-image" className="text-xs font-semibold text-ink">
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
            className="text-xs text-ink-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-surface-muted file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink hover:file:bg-surface file:cursor-pointer cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-md"
          />
        </div>

        {createPerson.isError && (
          <p className="text-xs font-medium text-danger-600">
            ⚠️ Failed to create profile. Please try again.
          </p>
        )}

        <div className="mt-2 flex justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={createPerson.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={createPerson.isPending}
            disabled={createPerson.isPending || !name.trim()}
          >
            Create Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
