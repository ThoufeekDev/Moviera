import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-brand-50 text-brand-700 border border-brand-100',
        primary: 'bg-brand-600 text-white',
        secondary: 'bg-surface-muted text-ink border border-border',
        outline: 'border border-border text-ink bg-surface',
        success: 'bg-emerald-50 text-success-700 border border-success-500/20',
        warning: 'bg-amber-50 text-warning-700 border border-warning-500/20',
        danger: 'bg-brand-50 text-danger-600 border border-brand-100',
        certification: 'bg-surface border border-border text-ink font-bold rounded-sm',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs md:text-sm',
        lg: 'px-3 py-1.5 text-sm',
      },
      pill: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      pill: true,
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
