import { useQuery } from '@tanstack/react-query';
import { getSuperAdminTheatreDetail } from '../api/getSuperAdminTheatreDetail.api';
import { theatreKeys } from '../keys';

export const useSuperAdminTheatreDetail = (theatreId: string) => {
  return useQuery({
    queryKey: theatreKeys.superAdminDetail(theatreId),
    queryFn: ({ signal }) => getSuperAdminTheatreDetail(theatreId, signal),
    enabled: Boolean(theatreId),
  });
};
