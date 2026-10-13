import { useQuery } from '@tanstack/react-query';
import { listEligibleTheatreAdmins } from '../api/superAdminTheatres.api';
import { theatreKeys } from '../keys';

export const useEligibleTheatreAdmins = (search?: string) => {
  return useQuery({
    queryKey: theatreKeys.eligibleAdmins(search),
    queryFn: () => listEligibleTheatreAdmins(search),
  });
};
