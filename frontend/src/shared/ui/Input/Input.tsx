import { type ComponentProps, forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

export interface InputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string | { message?: string } | null;
  helperText?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, containerClassName, className, id, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const errorMessage =
      typeof error === 'string'
        ? error
        : typeof error?.message === 'string'
          ? error.message
          : undefined;

    return (
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}

        <div className="relative flex w-full items-center">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            className={cn(
              'h-11 min-h-[44px] w-full rounded-md border border-border bg-surface px-3.5',
              'text-base text-ink placeholder:text-ink-muted',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
              // Spin buttons hidden for number inputs
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              // Date cursor
              'date:cursor-pointer',
              // Error state
              errorMessage && 'border-danger-600 focus-visible:ring-danger-600',
              className,
            )}
            {...props}
          />
        </div>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
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

        {helperText && !errorMessage && (
          <p className="text-xs md:text-sm text-ink-muted">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export default Input;
