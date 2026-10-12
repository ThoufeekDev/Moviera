import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const skeletonVariants = cva('bg-surface-muted animate-pulse select-none', {
  variants: {
    variant: {
      text: 'h-[1em] mb-[0.4em] rounded-sm',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-md',
    },
  },
  defaultVariants: {
    variant: 'rounded',
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export default function Skeleton({
  width,
  height,
  borderRadius,
  variant,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      style={{ width, height, borderRadius, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}
