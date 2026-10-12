import type { ReactNode } from 'react';

interface FormSectionProps {
  id?: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export default function FormSection({
  id,
  icon,
  title,
  description,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <section
      id={id}
      className={`rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card ${className}`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md border border-brand-500/20 bg-brand-50 text-brand-600">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <p className="text-xs text-ink-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
