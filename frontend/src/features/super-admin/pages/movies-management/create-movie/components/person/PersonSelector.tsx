import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { usePersons } from '../../../hooks/usePerson';
import styles from './PersonSelector.module.css';
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
    <div ref={containerRef} className={styles.selectorContainer}>
      {/* Search input */}
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>
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
          className={styles.searchInput}
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
            className={styles.clearButton}
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
        <div className={styles.dropdown}>
          {isLoading && (
            <div className={styles.noResults}>
              Loading persons...
            </div>
          )}

          {isError && (
            <div className={styles.noResults}>
              Failed to load persons.
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredPersons.map((person) => (
              <button
                key={person.id}
                type="button"
                className={styles.optionItem}
                onClick={() => handleSelectPerson(person)}
              >
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {person.name ? person.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}

                <span className={styles.personName}>{person.name}</span>
              </button>
            ))}

          {!isLoading && !isError && filteredPersons.length === 0 && (
            <div className={styles.noResults}>
              No matching profiles found
            </div>
          )}

          {/* Create new person */}
          {!isLoading && !isError && (
            <button
              type="button"
              className={styles.createOption}
              onClick={handleCreateNewPerson}
            >
              + Create profile for "{search.trim()}"
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isCreateModalOpen &&
        createPortal(
          <CreatePersonModal
            initialName={search.trim()}
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={handlePersonCreated}
          />,
          document.body,
        )}
    </div>
  );
}
