import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import MovieBasicInfo from './components/movie/BasicInfo';
import MovieLanguages from './components/movie/Language';
import MovieMedia from './components/movie/Media';
import MovieCast from './components/movie/Cast';
import MovieCrew from './components/movie/Crew';
import { Button } from '@/shared/ui/Button';

import {
  createMovieSchema,
  type CreateMovieFormInput,
  type CreateMovieFormData,
} from '../validators/createMovie.schema';
import { createMovie } from '../services/createMovie.service';

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-24 font-sans text-slate-900">
      {/* Dark Hero Header with Stepper */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span>🎬</span> Add New Movie
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
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
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    isActive ? 'bg-white text-brand-600' : 'bg-white/20 text-white'
                  }`}
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
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <span>{successMessage}</span>
        </div>
      )}

      {serverError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
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
            onClick={handlePrevStep}
            disabled={activeStep === 0 || isSubmitting}
          >
            ← Previous Step
          </Button>

          {activeStep < steps.length - 1 && (
            <Button
              type="button"
              variant="primary"
              onClick={handleNextStep}
              disabled={isSubmitting}
            >
              Next Step →
            </Button>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-md md:left-[260px]">
          <div className="text-xs font-semibold text-slate-500">
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="font-bold shadow-md shadow-brand-500/25"
            >
              Publish Movie
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
