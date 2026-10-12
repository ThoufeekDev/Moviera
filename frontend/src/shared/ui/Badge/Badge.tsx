import { type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';
import { badgeVariants, type BadgeVariants } from './badgeVariants';

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

export default function Badge({ className, variant, size, pill, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, pill }), className)} {...props} />
  );
}

export { Badge };
