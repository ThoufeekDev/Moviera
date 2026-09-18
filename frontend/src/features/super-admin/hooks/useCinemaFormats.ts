import { useQuery } from "@tanstack/react-query";

import { getCinemaFormats,type CinemaFormat } from "../services/getCinemaFormat.service";

export const useCinemaFormats = () => {
    return useQuery<CinemaFormat[]>({
        queryKey: ['cinemaFormats'],
        queryFn:getCinemaFormats,
    })
}