import { ShowListSection } from '@/features/shows';
import { useNavigate } from 'react-router-dom';

export interface TheatreShowsProps {
  theatreId: string;
}

export default function TheatreShows({ theatreId }: TheatreShowsProps) {
  const navigate = useNavigate();

  return (
    <ShowListSection
      theatreId={theatreId}
      onScheduleShow={() =>
        navigate(`/theatre-admin/theatres/${theatreId}/shows/create`)
      }
    />
  );
}
