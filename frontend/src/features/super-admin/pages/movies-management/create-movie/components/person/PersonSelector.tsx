import { useState, useRef, useEffect } from 'react';
import { usePersons } from '../../../hooks/usePerson';
import CreatePersonModal from './CreatePersonModal';
import type { Person } from '../person.types';

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
        <span className="pointer-events-none absolute left-3.5 text-slate-400">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          placeholder={placeholder}
          value={search}
          onFocus={() => {
            if (search.trim()) {
              setIsOpen(true);
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
            className="absolute right-3 rounded-full p-1 text-xs text-slate-400 hover:text-slate-600"
            onClick={() => {
              setSearch('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && search.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in duration-150">
          {isLoading && (
            <div className="px-4 py-3 text-center text-xs text-slate-500">
              Loading persons...
            </div>
          )}

          {isError && (
            <div className="px-4 py-3 text-center text-xs text-rose-500">
              Failed to load persons.
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredPersons.map((person) => (
              <button
                key={person.id}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
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

                <span className="font-medium text-slate-900">{person.name}</span>
              </button>
            ))}

          {!isLoading && !isError && filteredPersons.length === 0 && (
            <div className="px-4 py-3 text-center text-xs text-slate-500">
              No matching profiles found
            </div>
          )}

          {/* Create new person */}
          {!isLoading && !isError && (
            <button
              type="button"
              className="mt-1 flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-left text-xs font-bold text-brand-500 transition hover:bg-brand-50 rounded-lg"
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
