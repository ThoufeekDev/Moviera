import { cn } from '@/shared/lib/cn';
import { Check } from 'lucide-react';

export interface CreateShowStepperProps {
  activeStep: 1 | 2 | 3;
  onStepSelect?: (step: 1 | 2 | 3) => void;
}

const STEPS = [
  {
    step: 1 as const,
    title: 'Show Details',
    subtitle: 'Movie, screen and timing',
  },
  {
    step: 2 as const,
    title: 'Pricing',
    subtitle: 'Set ticket prices',
  },
  {
    step: 3 as const,
    title: 'Review',
    subtitle: 'Confirm and create',
  },
];

export default function CreateShowStepper({
  activeStep,
  onStepSelect,
}: CreateShowStepperProps) {
  return (
    <nav
      aria-label="Create show progress"
      className="rounded-lg border border-border bg-surface px-4 py-4 shadow-card sm:px-8"
    >
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {STEPS.map((item, index) => {
          const isActive = activeStep === item.step;
          const isCompleted = activeStep > item.step;

          return (
            <li
              key={item.step}
              className={cn(
                'flex items-center gap-3',
                index < STEPS.length - 1 && 'sm:flex-1',
              )}
            >
              <button
                type="button"
                onClick={() => onStepSelect?.(item.step)}
                className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 rounded-md"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    isActive && 'bg-brand-600 text-surface shadow-sm',
                    isCompleted && 'bg-success-500 text-surface',
                    !isActive &&
                      !isCompleted &&
                      'border border-border bg-surface-muted text-ink/60',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : item.step}
                </span>

                <div>
                  <p
                    className={cn(
                      'text-sm font-semibold leading-tight',
                      isActive ? 'text-brand-600' : 'text-ink',
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-ink/60">{item.subtitle}</p>
                </div>
              </button>

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-border sm:mx-4 sm:block"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

