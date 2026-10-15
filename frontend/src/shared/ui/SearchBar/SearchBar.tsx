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
  searchOnSubmitOnly?: boolean;
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
  debounceMs = 0,
  searchOnSubmitOnly = true,
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
  // Local state for immediate typing responsiveness (0ms lag)
  const [inputValue, setInputValue] = useState(value ?? defaultValue);
  const [prevPropValue, setPrevPropValue] = useState(value);

  // Synchronize internal state when value prop changes externally (e.g. parent clears filters)
  if (value !== undefined && value !== prevPropValue) {
    setPrevPropValue(value);
    setInputValue(value);
  }

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

  // Commit search: trims whitespace, triggers onSearch
  const commitSearch = useCallback(
    (termToCommit: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const trimmed = termToCommit.trim();
      lastCommittedSearchRef.current = trimmed;
      onSearch(trimmed);
    },
    [onSearch],
  );

  // Handle typing: immediate visual update, optional debounce only if searchOnSubmitOnly is false
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange?.(newVal);

    if (!searchOnSubmitOnly && debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        commitSearch(newVal);
      }, debounceMs);
    }
  };

  // Immediate commit on Form Submit (Enter or Button click)
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    commitSearch(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitSearch(inputValue);
    }
  };

  // Clear search input
  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setInputValue('');
    onChange?.('');
    lastCommittedSearchRef.current = '';
    onSearch('');
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
          value={inputValue}
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
            // Hide native browser clear button on search inputs to prevent two 'X' buttons
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
            inputClassName,
          )}
        />

        {/* Custom Clear X button */}
        {showClear && inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Clear search text"
            title="Clear search text"
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
          className={cn('shrink-0 h-11 px-5 flex items-center gap-2 font-medium cursor-pointer', buttonClassName)}
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
