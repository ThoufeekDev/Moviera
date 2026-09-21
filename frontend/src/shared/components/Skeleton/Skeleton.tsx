import type { HTMLAttributes } from "react";
import styles from "./Skeleton.module.css";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  borderRadius?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export default function Skeleton({
  width,
  height,
  borderRadius,
  variant,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const variantClass = variant ? styles[variant] || '' : '';

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      {...props}
    />
  );
}