import { type ComponentProps, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

// ── Variants ──────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold',
    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-65',
    'select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-500 text-white border border-transparent',
          'shadow-[0_4px_14px_rgba(248,68,100,0.3)]',
          'hover:bg-brand-600 hover:-translate-y-px hover:shadow-[0_8px_22px_rgba(248,68,100,0.45)]',
          'active:bg-brand-700 active:translate-y-px',
        ],
        secondary: [
          'bg-white text-slate-800 border border-slate-200',
          'shadow-[0_2px_6px_rgba(0,0,0,0.04)]',
          'hover:border-brand-500 hover:text-brand-500 hover:bg-brand-50 hover:-translate-y-px',
          'active:translate-y-0',
        ],
        ghost: [
          'bg-transparent text-slate-600 border border-transparent',
          'hover:bg-slate-100 hover:text-slate-900',
          'active:bg-slate-200',
        ],
        danger: [
          'bg-danger-500 text-white border border-transparent',
          'shadow-[0_4px_14px_rgba(248,68,100,0.3)]',
          'hover:bg-danger-600 hover:-translate-y-px',
          'active:translate-y-px',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-11 px-5 text-[0.95rem]',
        lg: 'h-12 px-7 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

// ── Types ─────────────────────────────────────────────────────────────────────

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends ComponentProps<'button'>,
    ButtonVariants {
  loading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
