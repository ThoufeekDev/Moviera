import api from "../../../../../api/axios";
import type { Movie } from "../types/movie.types";

interface GetMovieByIdResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Movie;
}

export const getMovieById = async (id: string): Promise<Movie> => {
  const response = await api.get<GetMovieByIdResponse>(`/movies/${id}`);
  return response.data.data;
};
