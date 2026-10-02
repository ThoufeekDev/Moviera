import { useQuery } from "@tanstack/react-query";
import { getMyTheatres } from "../services/getMyTheatre.service";


export const useMyTheatres = () => {
   return useQuery({
        queryKey: ['my-theatre'],
        queryFn:getMyTheatres,
    })
}