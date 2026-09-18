import api from "../../../../../api/axios";
import type { Movie } from "../types/movie.types";

interface GetMoviesResponse {
   statusCode:number,
  success: boolean;
  message: string;
  data: Movie[];
}

export const getMovies = async ():Promise<Movie[]> => {
    const response = await api.get<GetMoviesResponse>('/movies');

    return response.data.data;
}