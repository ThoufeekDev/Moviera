import { useState, useEffect, type ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

import MovieBasicInfo from './form/BasicInfo';
import MovieLanguages from './form/Language';
import MovieMedia from './form/Media';
import MovieCast from './form/Cast';
import MovieCrew from './form/Crew';

export const movieFormSteps = [
  {
    id: 0,
    title: 'Basic Info',
    fields: [
      'title',
      'description',
      'duration',
      'releaseDate',
      'primaryGenreId',
      'genreIds',
      'certificate',
    ] as const,
  },
  {
    id: 1,
    title: 'Languages & Formats',
    fields: ['languages', 'cinemaFormatIds'] as const,
  },
  {
    id: 2,
    title: 'Media & Visuals',
    fields: ['poster', 'backdrop', 'trailerUrl'] as const,
  },
  {
    id: 3,
    title: 'Cast',
    fields: ['cast'] as const,
  },
  {
    id: 4,
    title: 'Crew',
    fields: ['crew'] as const,
  },
];

export interface MovieFormProps<TInput extends Record<string, any>, TOutput> {
  schema: ZodType<any, any, any>;
  defaultValues: TInput;
  onSubmit: (data: TOutput) => Promise<void>;
  submitLabel: string;
  headerTitle: string;
  headerDescription: string;
  initialPosterUrl?: string | null;
  initialBackdropUrl?: string | null;
  onCancel?: () => void;
  backLink?: {
    to: string;
    label: string;
  };
  headerAction?: ReactNode;
}

export default function MovieForm<TInput extends Record<string, any>, TOutput>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel,
  headerTitle,
  headerDescription,
  initialPosterUrl,
  initialBackdropUrl,
  onCancel,
  backLink,
  headerAction,
}: MovieFormProps<TInput, TOutput>) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const methods = useForm<TInput, any, TOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const { handleSubmit, trigger, reset } = methods;

  useEffect(() => {
    reset(defaultValues as any);
  }, [defaultValues, reset]);

  const handleNextStep = async () => {
    const fieldsToValidate = movieFormSteps[activeStep].fields;
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid && activeStep < movieFormSteps.length - 1) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < activeStep) {
      setActiveStep(stepId);
      return;
    }

    const isValid = await trigger(movieFormSteps[activeStep].fields as any);
    if (isValid) {
      setActiveStep(stepId);
    }
  };

  const handleFormSubmit = async (data: TOutput) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      await onSubmit(data);
      setSuccessMessage('🎉 Operation completed successfully!');
    } catch (err: any) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Failed to save movie. Please review your input and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-28 font-sans text-ink">
        {/* Optional Top Navigation */}
        {backLink && (
          <div className="flex items-center">
            <Link
              to={backLink.to}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>{backLink.label}</span>
            </Link>
          </div>
        )}

        {/* Hero Header Section */}
        <div className="rounded-lg border border-border/20 bg-nav p-6 sm:p-8 text-nav-ink shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {headerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-nav-ink/70">
                {headerDescription}
              </p>
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>

          {/* Stepper Navigation Bar */}
          <div className="mt-6 flex flex-wrap gap-2">
            {movieFormSteps.map((step) => {
              const isActive = activeStep === step.id;

              return (
                <button
                  type="button"
                  key={step.id}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-card'
                      : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                      isActive ? 'bg-white text-brand-600 font-bold' : 'bg-white/20 text-white'
                    }`}
                    aria-hidden="true"
                  >
                    {step.id + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="rounded-md border border-success-500/30 bg-emerald-50 p-4 text-sm font-semibold text-success-700">
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="rounded-md border border-danger-600/30 bg-danger-600/10 p-4 text-sm font-semibold text-danger-600">
            <span>⚠️ {serverError}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-6">
          <div className={activeStep === 0 ? 'block' : 'hidden'}>
            <MovieBasicInfo />
          </div>

          <div className={activeStep === 1 ? 'block' : 'hidden'}>
            <MovieLanguages />
          </div>

          <div className={activeStep === 2 ? 'block' : 'hidden'}>
            <MovieMedia
              initialPosterUrl={initialPosterUrl}
              initialBackdropUrl={initialBackdropUrl}
            />
          </div>

          <div className={activeStep === 3 ? 'block' : 'hidden'}>
            <MovieCast />
          </div>

          <div className={activeStep === 4 ? 'block' : 'hidden'}>
            <MovieCrew />
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handlePrevStep}
              disabled={activeStep === 0 || isSubmitting}
            >
              ← Previous Step
            </Button>

            {activeStep < movieFormSteps.length - 1 && (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next Step →
              </Button>
            )}
          </div>

          {/* Sticky Action Footer */}
          <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-surface/95 px-4 sm:px-6 py-3.5 backdrop-blur-md pb-[max(0.875rem,env(safe-area-inset-bottom))] md:left-[260px] shadow-float">
            <div className="text-xs font-semibold text-ink-muted">
              Step {activeStep + 1} of {movieFormSteps.length}:{' '}
              <span className="text-ink font-bold">
                {movieFormSteps[activeStep].title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="font-bold shadow-card"
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
