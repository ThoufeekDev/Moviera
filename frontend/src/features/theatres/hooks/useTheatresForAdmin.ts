import { useQuery } from '@tanstack/react-query';
import { listTheatresForAdmin } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export const useTheatresForAdmin = (query?: {
  search?: string;
  city?: string;
  status?: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
}) => {
  return useQuery({
    queryKey: theatreKeys.forAdmin(query),
    queryFn: () => listTheatresForAdmin(query),
  });
};
