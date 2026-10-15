import { cn } from '@/shared/lib/cn';

export interface StatusOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  badgeClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export interface StatusFilterProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options?: StatusOption<T>[];
  label?: string;
  variant?: 'select' | 'segmented';
  className?: string;
  selectClassName?: string;
  id?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const DEFAULT_OPTIONS: StatusOption<string>[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function StatusFilter<T extends string = string>({
  value,
  onChange,
  options = DEFAULT_OPTIONS as unknown as StatusOption<T>[],
  label,
  variant = 'select',
  className,
  selectClassName,
  id = 'status-filter-select',
  disabled = false,
  ariaLabel = 'Filter by status',
}: StatusFilterProps<T>) {
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-lg border border-border bg-surface-muted/60 p-1',
          className,
        )}
        role="group"
        aria-label={ariaLabel}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all select-none cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                isSelected
                  ? cn('bg-surface text-ink font-bold shadow-card', option.activeClassName)
                  : cn('text-ink-muted hover:text-ink', option.inactiveClassName),
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <span>{option.label}</span>
              {typeof option.count === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-semibold',
                    option.badgeClassName
                      ? option.badgeClassName
                      : isSelected
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-surface-muted text-ink-muted',
                  )}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 shrink-0', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-ink-muted shrink-0"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          'h-11 rounded-lg border border-border bg-surface px-3.5',
          'text-base md:text-sm font-medium text-ink',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted cursor-pointer',
          selectClassName,
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
