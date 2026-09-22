import { MovieStatus } from "../../../../shared/enums/MovieStatus";

export interface GetMoviesQuery{
    page?: number,
    limit?: number,
    search?: string,
    status?: MovieStatus,
    sortBy?: 'title' | 'releaseDate' | 'createdAt' | "updatedAt";
    sortOrder?: 'asc' | 'desc';
}