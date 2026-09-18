import api from "../../../api/axios";
import type { CreateMovieFormData } from "../validators/createMovie.schema";


export const createMovie = async (
    data: CreateMovieFormData
) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('duration', String(data.duration));

    formData.append(
        'releaseDate',
        new Date(data.releaseDate).toISOString(),
    );

    formData.append('primaryGenreId', data.primaryGenreId);
    formData.append('certification', data.certificate);

    formData.append(
        'languages',
        JSON.stringify(data.languages)
    );

    formData.append(
  'cinemaFormatIds',
  JSON.stringify(data.cinemaFormatIds)
);

    formData.append(
        'cast',
        JSON.stringify(data.cast)
    );

    formData.append(
        'crew',
        JSON.stringify(data.crew)
    );

    formData.append('poster', data.poster);
    formData.append('backdrop', data.backdrop);

    if (data.trailerUrl) {
        formData.append(
            'trailerUrl',
            data.trailerUrl
        );
    }

    const response = await api.post('/movies', formData);
    
    console.log('response after creating the movie',response)
    return response.data;
    
}