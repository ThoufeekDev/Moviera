import { useState, useRef, useEffect } from 'react';
import { usePersons } from '../../hooks/usePersons';
import CreatePersonModal from './CreatePersonModal';
import type { Person } from '../../types/person.types';

interface PersonSelectorProps {
  onSelect: (person: Person) => void;
  placeholder?: string;
}

export default function PersonSelector({
  onSelect,
  placeholder = 'Search actor, director, or crew...',
}: PersonSelectorProps) {
  const { data: persons = [], isLoading, isError } = usePersons();

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPersons = persons.filter((person) =>
    person?.name
      ? person.name.toLowerCase().includes(search.trim().toLowerCase())
      : false,
  );

  const handleSelectPerson = (person: Person) => {
    onSelect(person);
    setSearch('');
    setIsOpen(false);
  };

  const handleCreateNewPerson = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(false);
    setIsCreateModalOpen(true);
  };

  const handlePersonCreated = (person: Person) => {
    onSelect(person);
    setSearch('');
    setIsCreateModalOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search input */}
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3.5 text-ink-muted">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-10 text-base md:text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          placeholder={placeholder}
          value={search}
          onFocus={() => {
            if (search.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              if (filteredPersons.length > 0) {
                handleSelectPerson(filteredPersons[0]);
              } else if (search.trim()) {
                setIsOpen(false);
                setIsCreateModalOpen(true);
              }
            }
          }}
          onChange={(event) => {
            const value = event.target.value;
            setSearch(value);
            setIsOpen(value.trim().length > 0);
          }}
        />

        {search && (
          <button
            type="button"
            className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-md text-xs text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            onClick={() => {
              setSearch('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && search.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-float animate-in fade-in duration-150">
          {isLoading && (
            <div className="px-4 py-3 text-center text-xs text-ink-muted">
              Loading persons...
            </div>
          )}

          {isError && (
            <div className="px-4 py-3 text-center text-xs text-danger-600">
              Failed to load persons.
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredPersons.map((person) => (
              <button
                key={person.id}
                type="button"
                className="flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                onClick={() => handleSelectPerson(person)}
              >
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {person.name ? person.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}

                <span className="font-medium text-ink">{person.name}</span>
              </button>
            ))}

          {!isLoading && !isError && filteredPersons.length === 0 && (
            <div className="px-4 py-3 text-center text-xs text-ink-muted">
              No matching profiles found
            </div>
          )}

          {/* Create new person */}
          {!isLoading && !isError && (
            <button
              type="button"
              className="mt-1 flex min-h-[44px] w-full items-center gap-2 border-t border-border px-3 py-2.5 text-left text-xs font-bold text-brand-600 transition-colors hover:bg-brand-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              onClick={handleCreateNewPerson}
            >
              + Create profile for &quot;{search.trim()}&quot;
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isCreateModalOpen && (
        <CreatePersonModal
          initialName={search.trim()}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handlePersonCreated}
        />
      )}
    </div>
  );
}
