import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../services/getMovieById.service";

export const useMovieById = (id?: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id!),
    enabled: Boolean(id),
  });
};
