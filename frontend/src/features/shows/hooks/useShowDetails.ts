import { useQuery } from '@tanstack/react-query';
import { getShowById } from '../api/shows.api';
import { showKeys } from '../keys';

export const useShowDetails = (showId: string | undefined) =>
  useQuery({
    queryKey: showKeys.detail(showId ?? ''),
    queryFn: ({ signal }) => getShowById(showId ?? '', signal),
    enabled: Boolean(showId),
  });

