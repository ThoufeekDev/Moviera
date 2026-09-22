import { useQuery } from "@tanstack/react-query";
import { getMovies, type GetMoviesParams } from "../services/getMovies.service";


export const useMovies = (params:GetMoviesParams={}) => {
    return useQuery({
        queryKey: ['movies',params],
        queryFn:()=>getMovies(params),
    })
}