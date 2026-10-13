import { useQuery } from "@tanstack/react-query";
import { getMyTheatres } from "../api/getMyTheatres.api";
import { theatreKeys } from "../keys";

export const useMyTheatres = () => {
   return useQuery({
        queryKey: theatreKeys.myTheatres(),
        queryFn: getMyTheatres,
    });
};