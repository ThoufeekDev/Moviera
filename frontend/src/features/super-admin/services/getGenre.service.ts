import api from "../../../api/axios";

export interface Genre {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get("/genre");

  return response.data.data;
};