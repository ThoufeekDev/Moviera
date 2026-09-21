import api from "../../../../../api/axios";
import type { UpdateMovieFormData } from "../validators/updateMovie.schema";

export const updateMovie = async (id: string, data: UpdateMovieFormData) => {
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.duration) formData.append('duration', String(data.duration));
  if (data.releaseDate) formData.append('releaseDate', new Date(data.releaseDate).toISOString());
  if (data.primaryGenreId) formData.append('primaryGenreId', data.primaryGenreId);
  if (data.certificate) formData.append('certification', data.certificate);
  if (data.languages) formData.append('languages', JSON.stringify(data.languages));
  if (data.cinemaFormatIds) formData.append('cinemaFormatIds', JSON.stringify(data.cinemaFormatIds));
  if (data.cast) formData.append('cast', JSON.stringify(data.cast));
  if (data.crew) formData.append('crew', JSON.stringify(data.crew));
  if (data.poster) formData.append('poster', data.poster);
  if (data.backdrop) formData.append('backdrop', data.backdrop);
  if (data.trailerUrl) formData.append('trailerUrl', data.trailerUrl);

  const response = await api.patch(`/movies/${id}`, formData);
  return response.data;
};
