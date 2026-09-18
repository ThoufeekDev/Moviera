import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../services/getMovies.service";


export const useMovies = () => {
    return useQuery({
        queryKey: ['movies'],
        queryFn:getMovies,
    })
}