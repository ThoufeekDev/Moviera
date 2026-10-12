import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import MovieBasicInfo from '../components/BasicInfo';
import MovieLanguages from '../components/Language';
import MovieMedia from '../components/Media';
import MovieCast from '../components/Cast';
import MovieCrew from '../components/Crew';
import { Button } from '@/shared/ui/Button';

import {
  createMovieSchema,
  type CreateMovieFormInput,
  type CreateMovieFormData,
} from '../schemas/createMovie.schema';
import { createMovie } from '../api/createMovie.api';

const steps = [
  {
    id: 0,
    title: 'Basic Info',
    fields: [
      'title',
      'description',
      'duration',
      'releaseDate',
      'primaryGenreId',
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

export default function SuperAdminCreateMoviePage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<CreateMovieFormInput, any, CreateMovieFormData>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: undefined,
      releaseDate: '',
      primaryGenreId: '',
      genreIds: [],
      certificate: undefined,
      languages: [],
      cinemaFormatIds: [],
      cast: [],
      crew: [],
      trailerUrl: '',
    },
  });

  const handleNextStep = async () => {
    const fieldsToValidate = steps[activeStep].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && activeStep < steps.length - 1) {
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
    } else {
      const isValid = await trigger(steps[activeStep].fields as any);
      if (isValid) {
        setActiveStep(stepId);
      }
    }
  };

  const onSubmit = async (data: CreateMovieFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      await createMovie(data);
      setSuccessMessage('🎉 Movie created successfully!');
      reset();
      setActiveStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to create movie:', err);
      setServerError(
        err?.response?.data?.message ||
          'Failed to create movie. Please verify your details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-28 font-sans text-ink">
      {/* Dark Hero Header with Stepper */}
      <div className="rounded-lg border border-border/20 bg-nav p-6 sm:p-8 text-nav-ink shadow-card">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            <span>🎬</span> Add New Movie
          </h1>
          <p className="text-xs sm:text-sm text-nav-ink/70">
            Fill out the cinematic parameters, poster visuals, audio languages, and feature cast and crew to add a movie.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {steps.map((step) => {
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

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        {/* Step 1: Basic Info */}
        <div className={activeStep === 0 ? 'block' : 'hidden'}>
          <MovieBasicInfo
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </div>

        {/* Step 2: Languages & Formats */}
        <div className={activeStep === 1 ? 'block' : 'hidden'}>
          <MovieLanguages control={control} errors={errors} />
        </div>

        {/* Step 3: Media & Visuals */}
        <div className={activeStep === 2 ? 'block' : 'hidden'}>
          <MovieMedia
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
          />
        </div>

        {/* Step 4: Cast */}
        <div className={activeStep === 3 ? 'block' : 'hidden'}>
          <MovieCast control={control} register={register} errors={errors} />
        </div>

        {/* Step 5: Crew */}
        <div className={activeStep === 4 ? 'block' : 'hidden'}>
          <MovieCrew control={control} register={register} errors={errors} />
        </div>

        {/* Step Navigation Row */}
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

          {activeStep < steps.length - 1 && (
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
            Step {activeStep + 1} of {steps.length}: <span className="text-ink font-bold">{steps[activeStep].title}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="font-bold shadow-card"
            >
              Publish Movie
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
