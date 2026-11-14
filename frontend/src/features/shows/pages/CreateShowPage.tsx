import {
  ContentLoader,
  ErrorState,
  FormErrorBanner,
} from '@/shared/ui';
import { ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CreateShowStepper from '../components/CreateShowStepper';
import ShowDetailsSection from '../components/ShowDetailsSection';
import ShowSummaryCard from '../components/ShowSummaryCard';
import TicketPricingSection from '../components/TicketPricingSection';
import { useCreateShowForm } from '../hooks/useCreateShowForm';

export default function CreateShowPage() {
  const { theatreId: paramTheatreId } = useParams<{ theatreId?: string }>();
  const [searchParams] = useSearchParams();
  const initialTheatreId =
    paramTheatreId ?? searchParams.get('theatreId') ?? undefined;

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const detailsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const {
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
    isLoadingInitialData,
    isLoadingScreens,
    isInitialError,
    refetchInitialData,
    isSubmitting,
    submittingMode,
    serverError,
    unmappedErrors,
    onDismissError,
    handleSaveAsDraft,
    handleCreateAndPublish,
  } = useCreateShowForm({ initialTheatreId });

  const showDate = form.watch('showDate');
  const basePriceRupees = Number(form.watch('basePriceRupees')) || 0;

  const handleStepSelect = (step: 1 | 2 | 3) => {
    setActiveStep(step);
    if (step === 1) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 2) {
      pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoadingInitialData) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ContentLoader subtext="Loading theatre and movie catalog..." />
      </div>
    );
  }

  if (isInitialError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ErrorState
          title="Failed to load scheduling data"
          message="Could not load theatres or active movies."
          onRetry={refetchInitialData}
        />
      </div>
    );
  }

  const backToShowsPath = selectedTheatre
    ? `/theatre-admin/theatres/${selectedTheatre.id}?tab=SHOWS`
    : '/theatre-admin/shows';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
      {/* Breadcrumb & Page Header */}
      <header className="flex flex-col gap-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-ink/60"
        >
          <Link
            to={backToShowsPath}
            className="hover:text-brand-600 transition-colors"
          >
            Shows
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-ink">Create Show</span>
        </nav>

        <h1 className="text-2xl font-bold text-ink">Create Show</h1>
        <p className="text-sm text-ink/60">
          Schedule a new movie show for your theatre
        </p>
      </header>

      {/* 3-Step Indicator Bar */}
      <CreateShowStepper
        activeStep={activeStep}
        onStepSelect={handleStepSelect}
      />

      {/* Server Error Banner */}
      {(serverError || unmappedErrors.length > 0) && (
        <FormErrorBanner
          message={serverError ?? 'Please fix the highlighted errors'}
          unmappedErrors={unmappedErrors}
          onDismiss={onDismissError}
        />
      )}

      {/* Main Two-Column Form + Summary Layout */}
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateAndPublish();
          }}
          noValidate
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start"
        >
          {/* Left Column: Show Details + Ticket Pricing */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div ref={detailsRef} onFocusCapture={() => setActiveStep(1)}>
              <ShowDetailsSection
                theatres={theatres}
                movies={movies}
                screens={screens}
                compatibleFormats={compatibleFormats}
                selectedMovie={selectedMovie}
                selectedScreen={selectedScreen}
                endTimeDate={endTimeDate}
                scheduleEvaluation={scheduleEvaluation}
                isCheckingSchedule={isCheckingSchedule}
                isLoadingScreens={isLoadingScreens}
                hideTheatreSelect={Boolean(paramTheatreId)}
              />
            </div>

            <div ref={pricingRef} onFocusCapture={() => setActiveStep(2)}>
              <TicketPricingSection categoryPrices={categoryPrices} />
            </div>
          </div>

          {/* Right Column: Sticky Show Summary Card */}
          <div
            ref={summaryRef}
            onFocusCapture={() => setActiveStep(3)}
            className="lg:col-span-4"
          >
            <ShowSummaryCard
              selectedTheatre={selectedTheatre}
              selectedMovie={selectedMovie}
              selectedScreen={selectedScreen}
              selectedFormat={selectedFormat}
              showDate={showDate}
              startTimeDate={startTimeDate}
              endTimeDate={endTimeDate}
              basePriceRupees={basePriceRupees}
              priceRange={priceRange}
              hasScheduleConflict={scheduleEvaluation.hasConflict}
              isSubmitting={isSubmitting}
              submittingMode={submittingMode}
              onSaveAsDraft={handleSaveAsDraft}
              onCreateAndPublish={handleCreateAndPublish}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
