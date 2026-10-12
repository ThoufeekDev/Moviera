import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMovie } from '../api/updateMovie.api';
import type { UpdateMovieFormData } from '../schemas/updateMovie.schema';
import { movieKeys } from '../keys';

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, data }: { movieId: string; data: UpdateMovieFormData }) =>
      updateMovie(movieId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.all });
    },
  });
};
