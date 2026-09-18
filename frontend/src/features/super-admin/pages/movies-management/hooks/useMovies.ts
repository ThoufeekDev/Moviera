import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../services/getMovies.service";


export const useMovies = async() => {
    return useQuery({
        queryKey: ['movies'],
        queryFn:getMovies,
    })
}