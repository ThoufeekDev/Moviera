import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';

import MovieBasicInfo from '../components/BasicInfo';
import MovieLanguages from '../components/Language';
import MovieMedia from '../components/Media';
import MovieCast from '../components/Cast';
import MovieCrew from '../components/Crew';
import { Button } from '@/shared/ui/Button';
import { ContentLoader } from '@/shared/ui/ContentLoader';
import { ErrorState } from '@/shared/ui/ErrorState';

import {
  updateMovieSchema,
  type UpdateMovieFormInput,
  type UpdateMovieFormData,
} from '../schemas/updateMovie.schema';

import { useMovieById } from '../hooks/useMovieById';
import { useUpdateMovie } from '../hooks/useUpdateMovie';

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

export default function EditMoviePage() {
  const navigate = useNavigate();
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isLoading,
    isError,
    error,
    refetch,
  } = useMovieById(movieId);

  const updateMovieMutation = useUpdateMovie();

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
  } = useForm<UpdateMovieFormInput, any, UpdateMovieFormData>({
    resolver: zodResolver(updateMovieSchema),
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

  useEffect(() => {
    if (!movie) return;

    reset({
      title: movie.title,
      description: movie.description ?? '',
      duration: movie.duration,
      releaseDate: movie.releaseDate
        ? new Date(movie.releaseDate).toISOString().split('T')[0]
        : '',
      primaryGenreId: movie.primaryGenre.id,
      genreIds: movie.genres.map((genre) => genre.id),
      certificate: movie.certification as UpdateMovieFormInput['certificate'],
      languages: movie.languages.map((language) => language.id),
      cinemaFormatIds: movie.cinemaFormats.map((format) => format.id),
      trailerUrl: movie.trailerUrl ?? '',
      cast: (movie.cast ?? []).map((member) => ({
        personId: (member as any).person?.id ?? member.id,
        character: member.character ?? '',
      })),
      crew: (movie.crew ?? []).map((member) => ({
        personId: (member as any).person?.id ?? member.id,
        job: member.job,
      })),
    });
  }, [movie, reset]);

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
      return;
    }

    const isValid = await trigger(steps[activeStep].fields as any);
    if (isValid) {
      setActiveStep(stepId);
    }
  };

  const onSubmit = async (data: UpdateMovieFormData) => {
    if (!movieId) return;

    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      await updateMovieMutation.mutateAsync({ movieId, data });
      setSuccessMessage('🎉 Movie updated successfully!');

      setTimeout(() => {
        navigate(`/super-admin/movies/${movieId}`);
      }, 1200);
    } catch (err) {
      console.error('Failed to update movie:', err);
      setServerError(
        err instanceof Error
          ? err.message
          : 'Failed to update movie. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!movieId) {
    return (
      <ErrorState
        title="Movie ID Missing"
        message="No valid movie ID was specified in the URL."
        onRetry={() => navigate('/super-admin/movies')}
        retryText="Back to Movies"
      />
    );
  }

  if (isLoading) {
    return <ContentLoader text="Loading Movie" subtext="Fetching movie details for editing..." />;
  }

  if (isError || !movie) {
    return (
      <ErrorState
        title="Failed to Load Movie"
        message={
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading the movie details.'
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-28 font-sans text-ink">
      {/* Top Header Navigation */}
      <div className="flex items-center">
        <Link
          to={`/super-admin/movies/${movieId}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Movie Details</span>
        </Link>
      </div>

      {/* Hero Header Section */}
      <div className="rounded-lg border border-border/20 bg-nav p-6 sm:p-8 text-nav-ink shadow-card">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            <span>🎬</span> Edit Movie: {movie.title}
          </h1>
          <p className="text-xs sm:text-sm text-nav-ink/70">
            Update the movie details, media visuals, language options, cast, and crew members.
          </p>
        </div>

        {/* Stepper Navigation Bar */}
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

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <div className={activeStep === 0 ? 'block' : 'hidden'}>
          <MovieBasicInfo
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className={activeStep === 1 ? 'block' : 'hidden'}>
          <MovieLanguages control={control} errors={errors} />
        </div>

        <div className={activeStep === 2 ? 'block' : 'hidden'}>
          <MovieMedia
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
          />
        </div>

        <div className={activeStep === 3 ? 'block' : 'hidden'}>
          <MovieCast control={control} register={register} errors={errors} />
        </div>

        <div className={activeStep === 4 ? 'block' : 'hidden'}>
          <MovieCrew control={control} register={register} errors={errors} />
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
              onClick={() => navigate(`/super-admin/movies/${movieId}`)}
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
              Update Movie
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}