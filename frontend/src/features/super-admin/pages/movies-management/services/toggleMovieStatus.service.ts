import api from "../../../../../api/axios";

interface ToggleMovieStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    isActive: boolean;
  };
}

export const toggleMovieStatus = async (
  movieId: string,
  isActive: boolean
): Promise<ToggleMovieStatusResponse["data"]> => {
  const response = await api.patch<ToggleMovieStatusResponse>(
    `/movies/${movieId}`,
    {
      isActive,
    }
  );

  return response.data.data;
};