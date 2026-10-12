import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium select-none cursor-pointer',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700 shadow-card',
        secondary: 'border border-brand-600 text-brand-600 bg-surface hover:bg-brand-50 active:bg-brand-100',
        ghost: 'bg-transparent text-ink hover:bg-surface-muted hover:text-ink',
        danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 shadow-card',
        outline: 'border border-border bg-surface text-ink hover:bg-surface-muted hover:border-ink-muted',
      },
      size: {
        sm: 'h-9 min-h-[36px] px-3 text-sm',
        md: 'h-11 min-h-[44px] px-5 text-sm md:text-base',
        lg: 'h-12 min-h-[48px] px-6 text-base',
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

export type ButtonVariants = VariantProps<typeof buttonVariants>;
