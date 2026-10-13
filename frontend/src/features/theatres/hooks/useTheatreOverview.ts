import { useQuery } from "@tanstack/react-query";
import { getOverview } from "../api/getTheatreOverview.api";
import { theatreKeys } from "../keys";

export const useTheatreOverview = (theatreId: string) => {
    return useQuery({
        queryKey: theatreKeys.overview(theatreId),
        queryFn: () => getOverview(theatreId),
        enabled: !!theatreId,
    });
};