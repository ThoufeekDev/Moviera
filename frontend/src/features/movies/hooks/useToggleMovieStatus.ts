import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleMovieStatus } from "../api/toggleMovieStatus.api";
import { movieKeys } from "../keys";

export const useToggleMovieStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      movieId,
      isActive,
    }: {
      movieId: string;
      isActive: boolean;
    }) => toggleMovieStatus(movieId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: movieKeys.all,
      });
    },
  });
};