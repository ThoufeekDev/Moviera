import { useQuery } from "@tanstack/react-query";

import {
    getLanguages,
    type Language
} from "../services/getLanguage.service";

export const useLanguages = () => {
    return useQuery<Language[]>({
        queryKey: ['languages'],
        queryFn:getLanguages
    })
}