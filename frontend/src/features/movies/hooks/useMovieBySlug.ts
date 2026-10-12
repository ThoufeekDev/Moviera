import { useQuery } from "@tanstack/react-query";   
import { getMovieBySlug } from "../api/getMovieBySlug.api";



export const useMovieBySlug = (slug?: string) => {
   return useQuery({
        queryKey: ['movie', slug],
        queryFn: () => getMovieBySlug(slug!),
        enabled:!!slug,
    })
}

