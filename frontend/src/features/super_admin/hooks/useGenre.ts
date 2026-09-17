import { useQuery } from "@tanstack/react-query";
import {
  getGenres,
  type Genre,
} from "../services/getGenre.service";

export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: getGenres,
  });
};