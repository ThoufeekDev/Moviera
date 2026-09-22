import api from "../../../../../api/axios";
import type { Movie } from "../types/movie.types";

interface GetMoviesResponse {
   statusCode:number,
  success: boolean;
  message: string;
    data: {
        movies: Movie[],
        pagination: {
            page: number,
            limit: number,
            total: number,
            totalPage:number,
        }
  }
}
export interface GetMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  sortBy?: 'title' | 'releaseDate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
export const getMovies = async (params: GetMoviesParams = {}):Promise<GetMoviesResponse['data']> => {
  const response = await api.get<GetMoviesResponse>('/movies', {
    params,
  });
    
  return response.data.data;
};