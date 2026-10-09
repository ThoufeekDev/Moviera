import { type ComponentProps, forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string | { message?: string } | null;
  helperText?: string;
  containerClassName?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

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
      <div className={cn('flex w-full flex-col gap-[0.45rem]', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center justify-between text-[0.88rem] font-bold tracking-[-0.01em] text-slate-800"
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
              'h-[46px] w-full rounded-xl border-[1.5px] border-slate-300 bg-white px-4',
              'text-[0.95rem] text-slate-900 font-normal placeholder:text-slate-400',
              'shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
              'outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'hover:not(:disabled):not(:focus):border-slate-400',
              'focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(248,68,100,0.14)]',
              // Spin buttons hidden for number inputs
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              // Date cursor
              'date:cursor-pointer',
              // Error state
              errorMessage && 'border-danger-700 bg-danger-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]',
              className,
            )}
            {...props}
          />
        </div>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
            className="mt-1 flex items-center gap-[0.35rem] text-[0.82rem] font-semibold text-danger-700"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </p>
        )}

        {helperText && !errorMessage && (
          <p className="mt-1 text-[0.82rem] text-slate-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export default Input;
