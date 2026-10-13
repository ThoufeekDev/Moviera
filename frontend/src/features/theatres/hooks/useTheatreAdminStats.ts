import { useQuery } from '@tanstack/react-query';
import { getTheatreAdminStats } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export const useTheatreAdminStats = () => {
  return useQuery({
    queryKey: theatreKeys.adminStats(),
    queryFn: getTheatreAdminStats,
  });
};
