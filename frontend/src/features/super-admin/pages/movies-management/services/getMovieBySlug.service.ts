import type { Movie } from "../types/movie.types";
import api from '../../../../../api/axios';


interface GetMovieslugResponse {
    statusCode:number,
    success: boolean,
    message: string,
    data:Movie
}


export const getMovieBySlug = async (slug: string) => {
    const response = await api.get<GetMovieslugResponse>(`/movies/slug/${slug}`);
    return response.data.data
}

