import { useQuery } from "@tanstack/react-query";
import { getMyTheatres } from "../api/getMyTheatres.api";


export const useMyTheatres = () => {
   return useQuery({
        queryKey: ['my-theatre'],
        queryFn:getMyTheatres,
    })
}