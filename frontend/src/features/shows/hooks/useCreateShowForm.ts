import { useMovies, type Movie, type MovieTheatreFormat } from '@/features/movies';
import {
  useMyTheatres,
  useScreens,
  type ScreenListItem,
  type Theatre,
} from '@/features/theatres';
import { setFormServerErrors } from '@/shared/lib/formErrors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DEFAULT_SEAT_ADJUSTMENTS_RUPEES,
  createShowFormSchema,
  type CreateShowFormValues,
} from '../schemas/createShowForm.schema';
import type { ShowDetail } from '../types/show.types';
import { buildCreateShowPayload } from '../utils/buildCreateShowPayload';
import { buildUpdateShowPayload } from '../utils/buildUpdateShowPayload';
import {
  computeSeatCategoryPrices,
  computeShowPriceRangeRupees,
} from '../utils/showPricing.utils';
import {
  calculateShowEndTime,
  combineDateAndTime,
  evaluateScreenScheduleSlot,
} from '../utils/showScheduling.utils';
import { useCreateShow } from './useCreateShow';
import { useShows } from './useShows';
import { useUpdateShow } from './useUpdateShow';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const KNOWN_CREATE_SHOW_FIELDS: readonly string[] = [
  'theatreId',
  'movieId',
  'screenId',
  'cinemaFormatId',
  'showDate',
  'showTime',
  'basePriceRupees',
  'priceAdjustmentsRupees',
  'priceAdjustmentsRupees.REGULAR',
  'priceAdjustmentsRupees.PREMIUM',
  'priceAdjustmentsRupees.RECLINER',
  'priceAdjustmentsRupees.SOFA',
  'priceAdjustmentsRupees.WHEELCHAIR',
];

export type ShowSubmitMode = 'DRAFT' | 'PUBLISH' | 'SAVE';

export interface EditShowContext {
  showId: string;
  original: ShowDetail;
  initialValues: CreateShowFormValues;
  /** True when bookings exist: only the schedule may be edited. */
  pricingLocked: boolean;
}

export interface UseCreateShowFormOptions {
  initialTheatreId?: string;
  edit?: EditShowContext;
}

export function useCreateShowForm({ initialTheatreId, edit }: UseCreateShowFormOptions = {}) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [unmappedErrors, setUnmappedErrors] = useState<string[]>([]);
  const [submittingMode, setSubmittingMode] = useState<ShowSubmitMode | null>(null);

  const form = useForm<CreateShowFormValues>({
    resolver: zodResolver(createShowFormSchema) as Resolver<CreateShowFormValues>,
    defaultValues: edit?.initialValues ?? {
      theatreId: initialTheatreId ?? '',
      movieId: '',
      screenId: '',
      cinemaFormatId: '',
      showDate: getTodayDateString(),
      showTime: '19:30',
      basePriceRupees: 150,
      priceAdjustmentsRupees: { ...DEFAULT_SEAT_ADJUSTMENTS_RUPEES },
    },
    mode: 'onChange',
  });

  const { watch, setValue, setError, handleSubmit } = form;
  const watchedValues = watch();

  const {
    data: theatres = [],
    isLoading: isLoadingTheatres,
    isError: isTheatresError,
    refetch: refetchTheatres,
  } = useMyTheatres();

  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    isError: isMoviesError,
    refetch: refetchMovies,
  } = useMovies({ status: 'ACTIVE', limit: 50 });

  const movies: Movie[] = useMemo(() => moviesData?.items ?? [], [moviesData]);

  // Pre-select first theatre if none was specified
  useEffect(() => {
    if (!watchedValues.theatreId && theatres.length > 0) {
      setValue('theatreId', initialTheatreId || theatres[0].id, {
        shouldValidate: true,
      });
    }
  }, [watchedValues.theatreId, theatres, initialTheatreId, setValue]);

  // Pre-select first active movie if none is selected yet
  useEffect(() => {
    if (!watchedValues.movieId && movies.length > 0) {
      setValue('movieId', movies[0].id, { shouldValidate: true });
    }
  }, [watchedValues.movieId, movies, setValue]);

  const selectedTheatre: Theatre | undefined = useMemo(
    () => theatres.find((t) => t.id === watchedValues.theatreId),
    [theatres, watchedValues.theatreId],
  );

  const {
    data: screensData,
    isLoading: isLoadingScreens,
  } = useScreens(watchedValues.theatreId, { status: 'ACTIVE', limit: 100 });

  const screens: ScreenListItem[] = useMemo(
    () => (screensData?.items ?? []).filter((s) => s.isActive && s.totalSeats > 0),
    [screensData],
  );

  // Pre-select first active configured screen when theatre changes (never in edit mode:
  // the backend does not allow moving a show to another screen)
  useEffect(() => {
    if (edit) return;
    if (screens.length === 0) {
      if (watchedValues.screenId) {
        setValue('screenId', '');
      }
      return;
    }

    const exists = screens.some((s) => s.id === watchedValues.screenId);
    if (!exists) {
      setValue('screenId', screens[0].id, { shouldValidate: true });
    }
  }, [screens, watchedValues.screenId, setValue, edit]);

  const selectedMovie: Movie | undefined = useMemo(
    () => movies.find((m) => m.id === watchedValues.movieId),
    [movies, watchedValues.movieId],
  );

  const selectedScreen: ScreenListItem | undefined = useMemo(
    () => screens.find((s) => s.id === watchedValues.screenId),
    [screens, watchedValues.screenId],
  );

  // Compute compatible formats supported by BOTH movie and screen
  const compatibleFormats: MovieTheatreFormat[] = useMemo(() => {
    const movieFormats = selectedMovie?.theatreFormats ?? [];
    if (!selectedScreen) return movieFormats;

    const screenFormats = selectedScreen.cinemaFormats ?? [];
    if (screenFormats.length === 0) return movieFormats;

    const screenFormatIds = new Set(screenFormats.map((f) => f.id));
    return movieFormats.filter((mf) => screenFormatIds.has(mf.id));
  }, [selectedMovie, selectedScreen]);

  // Keep cinemaFormatId synced to compatibleFormats (only once movie and screen are known,
  // so an edited show never loses its format while reference data is still loading)
  useEffect(() => {
    if (!selectedMovie || !selectedScreen) return;
    if (compatibleFormats.length === 0) {
      if (watchedValues.cinemaFormatId) {
        setValue('cinemaFormatId', '');
      }
      return;
    }

    const isStillCompatible = compatibleFormats.some(
      (f) => f.id === watchedValues.cinemaFormatId,
    );
    if (!isStillCompatible) {
      setValue('cinemaFormatId', compatibleFormats[0].id, {
        shouldValidate: true,
      });
    }
  }, [
    compatibleFormats,
    watchedValues.cinemaFormatId,
    selectedMovie,
    selectedScreen,
    setValue,
  ]);

  const selectedFormat = useMemo(
    () => compatibleFormats.find((f) => f.id === watchedValues.cinemaFormatId),
    [compatibleFormats, watchedValues.cinemaFormatId],
  );

  const { data: existingShowsData, isFetching: isCheckingSchedule } = useShows(
    {
      theatreId: watchedValues.theatreId,
      screenId: watchedValues.screenId,
      date: watchedValues.showDate,
      limit: 100,
    },
    Boolean(
      watchedValues.theatreId &&
        watchedValues.screenId &&
        watchedValues.showDate,
    ),
  );

  const startTimeDate = useMemo(
    () => combineDateAndTime(watchedValues.showDate, watchedValues.showTime),
    [watchedValues.showDate, watchedValues.showTime],
  );

  const endTimeDate = useMemo(
    () =>
      calculateShowEndTime(
        startTimeDate,
        selectedMovie?.duration ?? edit?.original.movie.duration,
      ),
    [startTimeDate, selectedMovie?.duration, edit?.original.movie.duration],
  );

  const scheduleEvaluation = useMemo(
    () =>
      evaluateScreenScheduleSlot({
        startTime: startTimeDate,
        endTime: endTimeDate,
        cleaningBufferMinutes: selectedTheatre?.cleaningBufferMinutes ?? 15,
        existingShows: existingShowsData?.items ?? [],
        excludeShowId: edit?.showId,
      }),
    [
      startTimeDate,
      endTimeDate,
      selectedTheatre?.cleaningBufferMinutes,
      existingShowsData?.items,
      edit?.showId,
    ],
  );

  const categoryPrices = useMemo(
    () =>
      computeSeatCategoryPrices(
        Number(watchedValues.basePriceRupees),
        watchedValues.priceAdjustmentsRupees ?? {},
      ),
    [watchedValues.basePriceRupees, watchedValues.priceAdjustmentsRupees],
  );

  const priceRange = useMemo(
    () =>
      computeShowPriceRangeRupees(
        Number(watchedValues.basePriceRupees),
        watchedValues.priceAdjustmentsRupees ?? {},
      ),
    [watchedValues.basePriceRupees, watchedValues.priceAdjustmentsRupees],
  );

  const createShowMutation = useCreateShow();
  const updateShowMutation = useUpdateShow();

  const navigateToShows = (theatreId: string) => {
    navigate(
      theatreId
        ? `/theatre-admin/theatres/${theatreId}?tab=SHOWS`
        : '/theatre-admin/shows',
    );
  };

  const applyServerError = (err: unknown) => {
    const mapped = setFormServerErrors(setError, err, {
      fieldAliases: {
        startTime: 'showTime',
        endTime: 'showTime',
        basePrice: 'basePriceRupees',
        priceAdjustments: 'priceAdjustmentsRupees',
      },
      knownFields: KNOWN_CREATE_SHOW_FIELDS,
    });
    setServerError(mapped.generalMessage);
    setUnmappedErrors(mapped.unmappedErrors);
  };

  const hasConflictError = (): boolean => {
    if (!scheduleEvaluation.hasConflict) return false;
    setError('showTime', {
      type: 'manual',
      message:
        'Selected show time conflicts with an existing show or cleaning buffer on this screen',
    });
    return true;
  };

  const submitWithMode = (publishImmediately: boolean) =>
    handleSubmit(async (values) => {
      setServerError(null);
      setUnmappedErrors([]);

      if (hasConflictError()) return;

      setSubmittingMode(publishImmediately ? 'PUBLISH' : 'DRAFT');

      try {
        const payload = buildCreateShowPayload(values);
        await createShowMutation.mutateAsync({
          payload,
          publishImmediately,
        });

        toast.success(
          publishImmediately
            ? 'Show created and published successfully!'
            : 'Show saved as draft!',
        );
        navigateToShows(values.theatreId);
      } catch (err: unknown) {
        applyServerError(err);
      } finally {
        setSubmittingMode(null);
      }
    });

  const handleSaveChanges = handleSubmit(async (values) => {
    if (!edit) return;
    setServerError(null);
    setUnmappedErrors([]);

    if (hasConflictError()) return;

    const payload = buildUpdateShowPayload(values, edit.initialValues, edit.pricingLocked);
    if (!payload) {
      toast.info('No changes to save.');
      return;
    }

    setSubmittingMode('SAVE');
    try {
      await updateShowMutation.mutateAsync({ showId: edit.showId, payload });
      toast.success('Show updated successfully!');
      navigateToShows(edit.original.theatre.id);
    } catch (err: unknown) {
      applyServerError(err);
    } finally {
      setSubmittingMode(null);
    }
  });

  return {
    form,
    theatres,
    movies,
    screens,
    compatibleFormats,
    selectedTheatre,
    selectedMovie,
    selectedScreen,
    selectedFormat,
    startTimeDate,
    endTimeDate,
    scheduleEvaluation,
    isCheckingSchedule,
    categoryPrices,
    priceRange,
    isLoadingInitialData: isLoadingTheatres || isLoadingMovies,
    isLoadingScreens,
    isInitialError: isTheatresError || isMoviesError,
    refetchInitialData: () => {
      refetchTheatres();
      refetchMovies();
    },
    isSubmitting: createShowMutation.isPending || updateShowMutation.isPending,
    submittingMode,
    serverError,
    unmappedErrors,
    onDismissError: () => {
      setServerError(null);
      setUnmappedErrors([]);
    },
    handleSaveAsDraft: submitWithMode(false),
    handleCreateAndPublish: submitWithMode(true),
    handleSaveChanges,
  };
}

