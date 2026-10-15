import {
  useState,
  useRef,
  useEffect,
  useId,
  useMemo,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { ChevronDown, Check, X, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  secondaryLabel?: string | null;
  disabled?: boolean;
}

export interface ComboboxProps {
  id?: string;
  label?: string;
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelectOption?: (option: ComboboxOption | null) => void;
  placeholder?: string;
  error?: string | { message?: string } | null;
  helperText?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  noResultsText?: string;
  clearable?: boolean;
  className?: string;
  containerClassName?: string;
  name?: string;
  autoFocus?: boolean;
}

export function Combobox({
  id,
  label,
  options = [],
  value,
  defaultValue = '',
  onChange,
  onSelectOption,
  placeholder = 'Select or search...',
  error,
  helperText,
  disabled = false,
  loading = false,
  loadingText = 'Loading options...',
  noResultsText = 'No results found',
  clearable = true,
  className,
  containerClassName,
  name,
  autoFocus = false,
}: ComboboxProps) {
  const generatedId = useId();
  const comboboxId = id || generatedId;
  const listboxId = `${comboboxId}-listbox`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value !== undefined ? value : defaultValue);
  const [prevControlledValue, setPrevControlledValue] = useState(value);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Synchronize internal value if controlled value prop changes
  if (value !== undefined && value !== prevControlledValue) {
    setPrevControlledValue(value);
    setInternalValue(value);
  }

  // Find currently selected option based on internal value
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === internalValue) || null;
  }, [options, internalValue]);

  // Format label for display (e.g. "Aurangabad, Maharashtra")
  const formatDisplayLabel = (opt: ComboboxOption | null): string => {
    if (!opt) return '';
    return opt.secondaryLabel ? `${opt.label}, ${opt.secondaryLabel}` : opt.label;
  };

  // Filter options based on user input
  const filteredOptions = useMemo(() => {
    if (!isTyping || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.trim().toLowerCase();
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(query);
      const secondaryMatch = option.secondaryLabel?.toLowerCase().includes(query);
      return labelMatch || secondaryMatch;
    });
  }, [options, isTyping, searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsTyping(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, activeIndex]);

  const selectOption = (option: ComboboxOption) => {
    if (option.disabled) return;
    setInternalValue(option.value);
    onChange?.(option.value);
    onSelectOption?.(option);
    setSearchQuery('');
    setIsTyping(false);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalValue('');
    onChange?.('');
    onSelectOption?.(null);
    setSearchQuery('');
    setIsTyping(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchQuery(text);
    setIsTyping(true);
    setActiveIndex(0);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (disabled || loading) return;
    setIsOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else if (filteredOptions.length > 0) {
          setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(filteredOptions.length - 1);
        } else if (filteredOptions.length > 0) {
          setActiveIndex((prev) =>
            prev <= 0 ? filteredOptions.length - 1 : prev - 1,
          );
        }
        break;
      }
      case 'Enter': {
        if (isOpen && activeIndex >= 0 && activeIndex < filteredOptions.length) {
          e.preventDefault();
          selectOption(filteredOptions[activeIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setIsTyping(false);
        setActiveIndex(-1);
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        setIsTyping(false);
        setActiveIndex(-1);
        break;
      }
      default:
        break;
    }
  };

  const errorMessage =
    typeof error === 'string'
      ? error
      : typeof error?.message === 'string'
        ? error.message
        : undefined;

  // Compute what text to display in the input box
  const inputValue = isTyping
    ? searchQuery
    : selectedOption
      ? formatDisplayLabel(selectedOption)
      : '';

  return (
    <div
      ref={containerRef}
      className={cn('relative flex w-full flex-col gap-1.5', containerClassName)}
    >
      {label && (
        <label
          htmlFor={comboboxId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}

      <div className="relative flex w-full items-center">
        {/* Left search icon */}
        <div className="pointer-events-none absolute left-3.5 flex items-center text-ink-muted">
          <Search className="h-4 w-4" aria-hidden="true" />
        </div>

        {/* Combobox input */}
        <input
          ref={inputRef}
          id={comboboxId}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${comboboxId}-option-${activeIndex}`
              : undefined
          }
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${comboboxId}-error` : undefined}
          disabled={disabled || loading}
          autoFocus={autoFocus}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={loading ? loadingText : placeholder}
          autoComplete="off"
          className={cn(
            'h-11 min-h-[44px] w-full rounded-md border border-border bg-surface pl-10 pr-20',
            'text-base md:text-sm text-ink placeholder:text-ink-muted',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
            errorMessage && 'border-danger-600 focus-visible:ring-danger-600',
            className,
          )}
        />

        {/* Right action buttons: Clear + Spinner or Chevron */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {clearable && !disabled && !loading && (internalValue || searchQuery) && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              title="Clear selection"
              className="flex h-6 w-6 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          {loading ? (
            <div className="flex h-6 w-6 items-center justify-center text-brand-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            </div>
          ) : (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }}
              className="flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:text-ink transition-colors cursor-pointer"
              aria-label={isOpen ? 'Close options' : 'Open options'}
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg animate-in fade-in-50 zoom-in-95 duration-100">
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label={label || 'Options'}
            className="max-h-60 overflow-y-auto py-1 text-sm focus:outline-none"
          >
            {loading ? (
              <li className="flex items-center justify-center gap-2 px-3 py-6 text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                <span>{loadingText}</span>
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="px-3 py-6 text-center text-ink-muted">
                <p className="font-medium">{noResultsText}</p>
                {searchQuery && (
                  <p className="mt-1 text-xs">
                    No results matching &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === internalValue;
                const isHighlighted = index === activeIndex;

                return (
                  <li
                    key={option.value}
                    id={`${comboboxId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'relative flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors select-none',
                      isHighlighted ? 'bg-surface-muted text-ink' : 'text-ink',
                      isSelected && 'bg-brand-50/60 font-medium text-brand-700',
                      option.disabled &&
                        'cursor-not-allowed opacity-50 bg-transparent text-ink-muted',
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="truncate font-medium text-ink">
                        {option.label}
                      </span>
                      {option.secondaryLabel && (
                        <span className="inline-flex shrink-0 items-center rounded bg-surface-muted px-1.5 py-0.5 text-xs font-normal text-ink-muted">
                          {option.secondaryLabel}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p
          id={`${comboboxId}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-danger-600"
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </p>
      )}

      {/* Helper text */}
      {helperText && !errorMessage && (
        <p className="text-xs md:text-sm text-ink-muted">{helperText}</p>
      )}
    </div>
  );
}

export default Combobox;
