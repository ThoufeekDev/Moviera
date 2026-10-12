import { useQuery } from "@tanstack/react-query";
import { getOverview } from "../api/getTheatreOverview.api";


export const useTheatreOverview = (theatreId:string) => {
    return useQuery({
        queryKey: ['theatre-overview',theatreId],
        queryFn: () => getOverview(theatreId),
        enabled: !!theatreId,
    })
}