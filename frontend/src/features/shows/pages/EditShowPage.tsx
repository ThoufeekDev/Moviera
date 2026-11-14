import { EmptyState, ErrorState } from '@/shared/ui';
import ShowFormSkeleton from '../components/ShowFormSkeleton';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { useShowDetails } from '../hooks/useShowDetails';
import { buildShowFormValuesFromDetail, hasBookingActivity } from '../utils/buildShowFormValues';
import CreateShowPage from './CreateShowPage';

export default function EditShowPage() {
  const navigate = useNavigate();
  const { showId } = useParams<{ showId: string }>();
  const { data: show, isLoading, isError, error, refetch } = useShowDetails(showId);

  const edit = useMemo(
    () =>
      show
        ? {
            showId: show.id,
            original: show,
            initialValues: buildShowFormValuesFromDetail(show),
            pricingLocked: hasBookingActivity(show),
          }
        : undefined,
    [show],
  );

  if (isLoading) {
    return <ShowFormSkeleton />;
  }

  if (isError || !show || !edit) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ErrorState
          title="Failed to load show"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (show.status === 'CANCELLED') {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <EmptyState
          title="Cancelled shows cannot be edited"
          description="This show was cancelled. Schedule a new show instead."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/theatre-admin/theatres/${show.theatre.id}?tab=SHOWS`)}
            >
              Back to shows
            </Button>
          }
        />
      </div>
    );
  }

  return <CreateShowPage key={show.id} edit={edit} />;
}

