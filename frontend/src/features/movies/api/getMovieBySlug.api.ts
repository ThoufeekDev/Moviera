import type { Movie } from "../types/movie.types";
import api from '@/shared/lib/axios';

interface GetMovieSlugResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Movie;
}

export const getMovieBySlug = async (slug: string): Promise<Movie> => {
  const response = await api.get<GetMovieSlugResponse>(`/movies/admin/slug/${slug}`);
  return response.data.data;
};
