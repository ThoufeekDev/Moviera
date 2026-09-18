import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import MovieBasicInfo from './components/movie/BasicInfo';
import MovieLanguages from './components/movie/Language';
import MovieMedia from './components/movie/Media';
import MovieCast from './components/movie/Cast';
import MovieCrew from './components/movie/Crew';

import {
  createMovieSchema,
  type CreateMovieFormInput,
  type CreateMovieFormData,
} from '../../../validators/createMovie.schema';
import { createMovie } from '../../../services/createMovie.service';
import styles from './CreateMoviePage.module.css';

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
      certificate:undefined,
      languages: [],
      cinemaFormatIds:[],
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
        err?.response?.data?.message || 'Failed to create movie. Please verify your details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Dark Hero Header with Stepper */}
      <div className={styles.heroHeader}>
        <div className={styles.headerTitleGroup}>
          <h1>
            <span>🎬</span> Add New Movie
          </h1>
          <p>
            Fill out the cinematic parameters, poster visuals, audio languages, and feature cast and crew to add a movie.
          </p>
        </div>

        <div className={styles.stepperBar}>
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                type="button"
                key={step.id}
                className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ''}`}
                onClick={() => handleStepClick(step.id)}
              >
                <span className={styles.stepNumber}>{step.id + 1}</span>
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

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Step 1: Basic Info */}
        <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
          <MovieBasicInfo
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </div>

        {/* Step 2: Languages & Formats */}
        <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
          <MovieLanguages
            control={control}
            errors={errors}
          />
        </div>

        {/* Step 3: Media & Visuals */}
        <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
          <MovieMedia
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
          />
        </div>

        {/* Step 4: Cast */}
        <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
          <MovieCast
            control={control}
            register={register}
            errors={errors}
          />
        </div>

        {/* Step 5: Crew */}
        <div style={{ display: activeStep === 4 ? 'block' : 'none' }}>
          <MovieCrew
            control={control}
            register={register}
            errors={errors}
          />
        </div>

        {/* Step Navigation Row */}
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

        {/* Sticky Action Footer */}
        <div className={styles.actionFooter}>
          <div className={styles.footerInfo}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(-1)}
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
                  <div className={styles.spinner}></div>
                  <span>Creating Movie...</span>
                </>
              ) : (
                <span>Publish Movie</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
