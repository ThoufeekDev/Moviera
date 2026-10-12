import { useQuery } from "@tanstack/react-query";

import {
    getLanguages,
    type Language
} from "../api/getLanguage.api";

export const useLanguages = () => {
    return useQuery<Language[]>({
        queryKey: ['languages'],
        queryFn:getLanguages
    })
}