import { useQuery } from "@tanstack/react-query";
import { getMovies, type GetMoviesParams } from "../api/getMovies.api";


export const useMovies = (params:GetMoviesParams={}) => {
    return useQuery({
        queryKey: ['movies',params],
        queryFn:()=>getMovies(params),
    })
}