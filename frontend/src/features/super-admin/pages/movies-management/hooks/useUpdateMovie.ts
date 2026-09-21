import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMovie } from '../services/updateMovie.service';
import type { UpdateMovieFormData } from '../validators/updateMovie.schema';

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, data }: { movieId: string; data: UpdateMovieFormData }) =>
      updateMovie(movieId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movie', variables.movieId] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};
