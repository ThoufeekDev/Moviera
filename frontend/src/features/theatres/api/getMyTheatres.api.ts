import type { Theatre } from "../types/theatre.types";
import api from "@/shared/lib/axios";

interface GetMyTheatresResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Theatre[];
}

export const getMyTheatres = async (): Promise<Theatre[]> => {
  const response = await api.get<GetMyTheatresResponse>('/theatres/my-theatres');
  return response.data.data;
};