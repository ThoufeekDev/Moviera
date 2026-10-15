import { useState, useRef, useEffect, useCallback, type FormEvent, type ChangeEvent, type KeyboardEvent } from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onSearch: (searchTerm: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  showButton?: boolean;
  buttonText?: string;
  showClear?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
}

export default function SearchBar({
  value,
  defaultValue = '',
  onSearch,
  onChange,
  placeholder = 'Search...',
  debounceMs = 400,
  showButton = true,
  buttonText = 'Search',
  showClear = true,
  className,
  inputClassName,
  buttonClassName,
  disabled = false,
  autoFocus = false,
  ariaLabel = 'Search',
}: SearchBarProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const displayValue = isControlled ? value : uncontrolledValue;

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedSearchRef = useRef<string>(value ?? defaultValue);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Commit search: trims whitespace, prevents duplicates
  const commitSearch = useCallback(
    (termToCommit: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const trimmed = termToCommit.trim();
      if (trimmed !== lastCommittedSearchRef.current) {
        lastCommittedSearchRef.current = trimmed;
        onSearch(trimmed);
      }
    },
    [onSearch],
  );

  // Handle typing with debounce
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (!isControlled) {
      setUncontrolledValue(newVal);
    }
    onChange?.(newVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (debounceMs > 0) {
      debounceTimerRef.current = setTimeout(() => {
        commitSearch(newVal);
      }, debounceMs);
    }
  };

  // Immediate commit on Form Submit (Enter or Button click)
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    commitSearch(displayValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitSearch(displayValue);
    }
  };

  // Clear search input
  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (!isControlled) {
      setUncontrolledValue('');
    }
    onChange?.('');
    if (lastCommittedSearchRef.current !== '') {
      lastCommittedSearchRef.current = '';
      onSearch('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn('flex items-center gap-2', className)}
    >
      <div className="relative flex-1 min-w-0">
        {/* Search icon */}
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted shrink-0"
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

        <input
          type="search"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          className={cn(
            'h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-9',
            'text-base md:text-sm text-ink placeholder:text-ink-muted',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
            inputClassName,
          )}
        />

        {/* Clear X button */}
        {showClear && displayValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
            aria-label="Clear search text"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Visible Submit Button */}
      {showButton && (
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={disabled}
          className={cn('shrink-0 h-11 px-5 flex items-center gap-2 font-medium', buttonClassName)}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>{buttonText}</span>
        </Button>
      )}
    </form>
  );
}
