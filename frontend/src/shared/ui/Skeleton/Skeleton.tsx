import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

// ── Variants ──────────────────────────────────────────────────────────────────

const skeletonVariants = cva('skeleton-shimmer', {
  variants: {
    variant: {
      text: 'h-[1em] mb-[0.4em] rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg',
    },
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string;
  height?: string;
  borderRadius?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

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
      {...props}
    />
  );
}
