import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';

import MovieBasicInfo from '../create-movie/components/movie/BasicInfo';
import MovieLanguages from '../create-movie/components/movie/Language';
import MovieMedia from '../create-movie/components/movie/Media';
import MovieCast from '../create-movie/components/movie/Cast';
import MovieCrew from '../create-movie/components/movie/Crew';

import {
  updateMovieSchema,
  type UpdateMovieFormInput,
  type UpdateMovieFormData,
} from '../validators/updateMovie.schema';

import { useMovieById } from '../hooks/useMovieById';
import { useUpdateMovie } from '../hooks/useUpdateMovie';

import MovieFormSkeleton from '../components/skeletons/MovieFormSkeleton';
import ErrorState from '../../../../../shared/components/ErrorState/ErrorState';

import styles from './EditMoviePage.module.css';

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
      certificate: movie.certification as UpdateMovieFormInput['certificate'],
      languages: movie.languages.map((language) => language.id),
      cinemaFormatIds: movie.cinemaFormats.map((format) => format.id),
      trailerUrl: movie.trailerUrl ?? '',
      cast: (movie.cast ?? []).map((member) => ({
        personId: member.person.id,
        character: member.character ?? '',
      })),
      crew: (movie.crew ?? []).map((member) => ({
        personId: member.person.id,
        job: member.job,
      })),
    });
  }, [movie, reset]);

  const handleNextStep = async () => {
    const fieldsToValidate = steps[activeStep].fields;
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
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
    return <MovieFormSkeleton />;
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
    <div className={styles.pageContainer}>
      {/* Top Header Navigation */}
      <div className={styles.topNav}>
        <Link to={`/super-admin/movies/${movieId}`} className={styles.backBtn}>
          <svg className={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Movie Details</span>
        </Link>
      </div>

      {/* Hero Header Section */}
      <div className={styles.heroHeader}>
        <div className={styles.headerTitleGroup}>
          <h1>
            <span>🎬</span> Edit Movie: {movie.title}
          </h1>
          <p>
            Update the movie details, media visuals, language options, cast, and crew members.
          </p>
        </div>

        {/* Stepper Navigation Bar */}
        <div className={styles.stepperBar}>
          {steps.map((step) => {
            const isActive = activeStep === step.id;

            return (
              <button
                type="button"
                key={step.id}
                className={`${styles.stepItem} ${
                  isActive ? styles.stepItemActive : ''
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <span className={styles.stepNumber}>
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
        <div className={styles.alertSuccess}>
          <span>{successMessage}</span>
        </div>
      )}

      {serverError && (
        <div className={styles.alertError}>
          <span>⚠️ {serverError}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.stepContentCard}>
          <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
            <MovieBasicInfo
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </div>

          <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
            <MovieLanguages
              control={control}
              errors={errors}
            />
          </div>

          <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
            <MovieMedia
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
            />
          </div>

          <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
            <MovieCast
              control={control}
              register={register}
              errors={errors}
            />
          </div>

          <div style={{ display: activeStep === 4 ? 'block' : 'none' }}>
            <MovieCrew
              control={control}
              register={register}
              errors={errors}
            />
          </div>

          {/* Step Navigation Controls */}
          <div className={styles.stepNavRow}>
            <button
              type="button"
              className={styles.prevStepBtn}
              onClick={handlePrevStep}
              disabled={activeStep === 0 || isSubmitting}
            >
              ← Previous Step
            </button>

            {activeStep < steps.length - 1 && (
              <button
                type="button"
                className={styles.nextStepBtn}
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next Step →
              </button>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className={styles.actionFooter}>
          <div className={styles.footerInfo}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(`/super-admin/movies/${movieId}`)}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  <span>Updating Movie...</span>
                </>
              ) : (
                <span>Update Movie</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}