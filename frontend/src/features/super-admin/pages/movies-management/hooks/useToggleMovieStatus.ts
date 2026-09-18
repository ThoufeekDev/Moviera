import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleMovieStatus } from "../services/toggleMovieStatus.service";

// ! useMutation → used for operations that change data on the server.
// ^ useQueryClient → gives you access to TanStack Query's cache.
export const useToggleMovieStatus = () => {
    // &This gives you access to the TanStack Query cache.

    const queryClient = useQueryClient();


    // * Whenever this mutation is executed, call toggleMovieStatus() with movieId and isActive
 return useMutation({
    
    mutationFn: ({
      movieId,
      isActive,
    }: {
      movieId: string;
      isActive: boolean;
    }) => toggleMovieStatus(movieId, isActive),
     
     // & anStack Query calls onSuccess after the mutation succeeds.

     // * variables contains whatever you passed to mutate().
     onSuccess: (_, variables) => {
        // * this is for movies
      queryClient.invalidateQueries({
        queryKey: ["movies"],
      });
        // * this is for movieDetials
      queryClient.invalidateQueries({
        queryKey: ["movie", variables.movieId],
      });
    },
  });
};