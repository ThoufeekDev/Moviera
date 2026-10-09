import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

export const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-500 text-white shadow hover:bg-brand-600',
        secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100',
        success: 'border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50',
        warning: 'border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50',
        danger: 'border-transparent bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50',
        outline: 'border border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200',
      },
      size: {
        sm: 'rounded-md px-2 py-0.5 text-xs',
        md: 'rounded-lg px-2.5 py-1 text-xs font-semibold',
        lg: 'rounded-lg px-3 py-1.5 text-sm font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export default function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
