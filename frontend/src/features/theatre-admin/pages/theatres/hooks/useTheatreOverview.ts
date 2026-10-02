import { useQuery } from "@tanstack/react-query";
import { getOverview } from "../services/getTheatreOverview.service";


export const useTheatreOverview = (theatreId:string) => {
    return useQuery({
        queryKey: ['theatre-overview',theatreId],
        queryFn: () => getOverview(theatreId),
        enabled: !!theatreId,
    })
}